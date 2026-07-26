import Requisition           from '@/models/Requisition';
import AuditLog              from '@/models/AuditLog';
import Notification          from '@/models/Notification';
import User                  from '@/models/User';
import { connectDB }         from '@/lib/db';
import { generateReqNumber } from '@/utils/generateId';
import { sendMail }          from '@/lib/mailer';

export const getAllRequisitions = async (filters = {}, user) => {
  await connectDB();

  const query = {};

  if (user.role === 'requester') query.requester  = user.id;
  if (user.role === 'hod' && user.department) {
    query.department = user.department;
  }

  if (filters.status   && filters.status   !== '') query.status   = filters.status;
  if (filters.priority && filters.priority !== '') query.priority  = filters.priority;
  if (filters.category && filters.category !== '') query.category  = filters.category;

  return Requisition.find(query)
    .populate('requester',  'name email role')
    .populate('department', 'name code')
    .populate('vendor',     'name')
    .sort({ createdAt: -1 });
};

export const getOneRequisition = async (id) => {
  await connectDB();

  const req = await Requisition.findById(id)
    .populate('requester',            'name email role phone')
    .populate('department',           'name code hodName')
    .populate('vendor',               'name email phone location')
    .populate('approvals.approver',   'name role email');

  if (!req) throw { statusCode: 404, message: 'Requisition not found' };
  return req;
};

export const createRequisition = async (body, user) => {
  await connectDB();

  const { items, ...rest } = body;

  const req = await Requisition.create({
    ...rest,
    reqNumber:  generateReqNumber(),
    requester:  user.id,
    department: user.department || body.department,
    items:      items || [],
    status:     'draft',
  });

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      'CREATED',
    details:     'Requisition created as draft',
  });

  return getOneRequisition(req._id);
};

export const updateRequisition = async (id, body, user) => {
  await connectDB();

  const req = await Requisition.findById(id);
  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  if (
    req.requester.toString() !== user.id &&
    user.role !== 'admin'
  ) {
    throw { statusCode: 403, message: 'Not authorized to update this requisition' };
  }

  if (!['draft', 'rejected'].includes(req.status)) {
    throw { statusCode: 400, message: 'Cannot edit a submitted requisition' };
  }

  Object.assign(req, body);
  await req.save();

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      'UPDATED',
    details:     'Requisition details updated',
  });

  return getOneRequisition(req._id);
};

export const submitRequisition = async (id, user) => {
  await connectDB();

  const req = await Requisition.findById(id).populate('department');

  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  if (!['draft', 'rejected'].includes(req.status)) {
    throw { statusCode: 400, message: 'Requisition has already been submitted' };
  }

  const hod = await User.findOne({
    role:       'hod',
    department: req.department._id,
    isActive:   true,
  }).select('_id name email');

  const approvalChain = [
    { role: 'hod',         level: 0, status: 'pending', approver: hod?._id || null },
    { role: 'procurement', level: 1, status: 'pending', approver: null },
    { role: 'finance',     level: 2, status: 'pending', approver: null },
    { role: 'vc',          level: 3, status: 'pending', approver: null },
  ];

  req.approvals = approvalChain;
  req.status    = 'pending_hod';
  await req.save();

  if (hod) {
    await Notification.create({
      user:        hod._id,
      title:       'New Requisition Pending Approval',
      message:     `${req.reqNumber} — "${req.title}" requires your approval`,
      type:        'warning',
      requisition: req._id,
      actionUrl:   `/requisitions/${req._id}`,
    });

    await sendMail({
      to:      hod.email,
      subject: `[Action Required] ${req.reqNumber} — Pending HOD Approval`,
      html: `
        <div style="font-family:Sora,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#00C37B">Approval Required</h2>
          <p>Dear ${hod.name},</p>
          <p>
            Requisition <strong>${req.reqNumber}</strong>
            — "${req.title}" requires your approval.
          </p>
          <p>
            Amount:
            <strong>₦${Number(req.totalAmount).toLocaleString()}</strong>
          </p>
          <p>
            Priority:
            <strong style="text-transform:capitalize">
              ${req.priority}
            </strong>
          </p>
          <a
            href="${process.env.NEXT_PUBLIC_APP_URL}/requisitions/${req._id}"
            style="display:inline-block;background:#00C37B;color:#000;
                   padding:12px 24px;border-radius:8px;font-weight:700;
                   text-decoration:none;margin-top:16px"
          >
            Review Requisition
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px">
            KSU Procurement System — Kaduna State University
          </p>
        </div>
      `,
    });
  }

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      'SUBMITTED',
    details:     hod
      ? `Submitted for HOD approval — notified ${hod.name}`
      : 'Submitted for HOD approval — no HOD found for department',
  });

  return getOneRequisition(req._id);
};

export const withdrawRequisition = async (id, user) => {
  await connectDB();

  const req = await Requisition.findById(id);
  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  if (req.requester.toString() !== user.id) {
    throw { statusCode: 403, message: 'Not authorized to withdraw this requisition' };
  }

  if (!['pending_hod'].includes(req.status)) {
    throw { statusCode: 400, message: 'Only requisitions pending HOD review can be withdrawn' };
  }

  req.status = 'draft';
  await req.save();

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      'WITHDRAWN',
    details:     'Requisition withdrawn by requester',
  });

  return getOneRequisition(req._id);
};

export const deleteRequisition = async (id, user) => {
  await connectDB();

  const req = await Requisition.findById(id);
  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  if (req.status !== 'draft' && user.role !== 'admin') {
    throw { statusCode: 400, message: 'Only draft requisitions can be deleted' };
  }

  await req.deleteOne();
};connectDB();
