import Requisition   from '@/models/Requisition';
import User          from '@/models/User';
import AuditLog      from '@/models/AuditLog';
import Notification  from '@/models/Notification';
import Budget        from '@/models/Budget';
import { connectDB } from '@/lib/db';
import { sendMail }  from '@/lib/mailer';

const ROLE_SEQUENCE = ['hod', 'procurement', 'finance', 'vc'];

const NEXT_STATUS = {
  hod:         'pending_procurement',
  procurement: 'pending_finance',
  finance:     'pending_vc',
  vc:          'approved',
};

const NEXT_ROLE = {
  hod:         'procurement',
  procurement: 'finance',
  finance:     'vc',
};

const populateRequisition = (id) =>
  Requisition.findById(id)
    .populate('requester',          'name email role')
    .populate('department',         'name code')
    .populate('vendor',             'name')
    .populate('approvals.approver', 'name role');

export const getApprovalQueue = async (user) => {
  await connectDB();

  const statusMap = {
    hod:         'pending_hod',
    procurement: 'pending_procurement',
    finance:     'pending_finance',
    vc:          'pending_vc',
  };

  const status = statusMap[user.role];
  if (!status) return [];

  const query = { status };

  if (user.role === 'hod' && user.department) {
    query.department = user.department;
  }

  return Requisition.find(query)
    .populate('requester',  'name email')
    .populate('department', 'name code')
    .sort({ createdAt: -1 });
};

export const approveRequisition = async (reqId, user, comment) => {
  await connectDB();

  const req = await Requisition.findById(reqId)
    .populate('requester',  'name email')
    .populate('department', 'name');

  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  const roleIndex = ROLE_SEQUENCE.indexOf(user.role);
  if (roleIndex === -1) {
    throw { statusCode: 403, message: 'Your role cannot approve requisitions' };
  }

  const approval = req.approvals[roleIndex];
  if (!approval) {
    throw { statusCode: 400, message: 'Approval record not found' };
  }
  if (approval.status !== 'pending') {
    throw { statusCode: 400, message: 'You have already actioned this requisition' };
  }

  req.approvals[roleIndex].status    = 'approved';
  req.approvals[roleIndex].comment   = comment || '';
  req.approvals[roleIndex].decidedAt = new Date();
  req.approvals[roleIndex].approver  = user.id;

  const nextStatus = NEXT_STATUS[user.role];
  req.status       = nextStatus;
  await req.save();

  if (nextStatus === 'approved') {
    const year = new Date().getFullYear();

    await Budget.findOneAndUpdate(
      { department: req.department._id, fiscalYear: year },
      { $inc: { amountSpent: req.totalAmount } }
    );

    await Notification.create({
      user:        req.requester._id,
      title:       'Requisition Fully Approved! 🎉',
      message:     `${req.reqNumber} has been fully approved`,
      type:        'success',
      requisition: req._id,
      actionUrl:   `/requisitions/${req._id}`,
    });

    await sendMail({
      to:      req.requester.email,
      subject: `✅ ${req.reqNumber} — Fully Approved`,
      html: `
        <div style="font-family:Sora,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#00C37B">Requisition Approved!</h2>
          <p>Dear ${req.requester.name},</p>
          <p>
            Your requisition <strong>${req.reqNumber}</strong>
            has been <strong style="color:#00C37B">fully approved</strong>.
          </p>
          <p>
            Amount:
            <strong>₦${Number(req.totalAmount).toLocaleString()}</strong>
          </p>
          <a
            href="${process.env.NEXT_PUBLIC_APP_URL}/requisitions/${req._id}"
            style="display:inline-block;background:#00C37B;color:#000;
                   padding:12px 24px;border-radius:8px;font-weight:700;
                   text-decoration:none;margin-top:16px"
          >
            View Requisition
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px">
            KSU Procurement System — Kaduna State University
          </p>
        </div>
      `,
    });

  } else {
    const nextRole  = NEXT_ROLE[user.role];
    const nextUsers = await User.find({ role: nextRole, isActive: true });

    for (const nextUser of nextUsers) {
      await Notification.create({
        user:        nextUser._id,
        title:       'Requisition Pending Your Approval',
        message:     `${req.reqNumber} — "${req.title}" requires your review`,
        type:        'warning',
        requisition: req._id,
        actionUrl:   `/requisitions/${req._id}`,
      });

      await sendMail({
        to:      nextUser.email,
        subject: `[Action Required] ${req.reqNumber} — Pending ${nextRole.toUpperCase()} Approval`,
        html: `
          <div style="font-family:Sora,sans-serif;max-width:560px;margin:auto">
            <h2>Approval Required</h2>
            <p>Dear ${nextUser.name},</p>
            <p>
              Requisition <strong>${req.reqNumber}</strong>
              requires your approval as <strong>${nextRole}</strong>.
            </p>
            <p>
              Amount:
              <strong>₦${Number(req.totalAmount).toLocaleString()}</strong>
            </p>
            <a
              href="${process.env.NEXT_PUBLIC_APP_URL}/requisitions/${req._id}"
              style="display:inline-block;background:#00C37B;color:#000;
                     padding:12px 24px;border-radius:8px;font-weight:700;
                     text-decoration:none;margin-top:16px"
            >
              Review & Approve
            </a>
          </div>
        `,
      });
    }
  }

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      `APPROVED_BY_${user.role.toUpperCase()}`,
    details:     comment || 'Approved',
  });

  return populateRequisition(reqId);
};

export const rejectRequisition = async (reqId, user, comment) => {
  await connectDB();

  const req = await Requisition.findById(reqId)
    .populate('requester', 'name email');

  if (!req) throw { statusCode: 404, message: 'Requisition not found' };

  const roleIndex = ROLE_SEQUENCE.indexOf(user.role);
  if (roleIndex === -1) {
    throw { statusCode: 403, message: 'Your role cannot reject requisitions' };
  }

  const approval = req.approvals[roleIndex];
  if (!approval) {
    throw { statusCode: 400, message: 'Approval record not found' };
  }
  if (approval.status !== 'pending') {
    throw { statusCode: 400, message: 'You have already actioned this requisition' };
  }

  req.approvals[roleIndex].status    = 'rejected';
  req.approvals[roleIndex].comment   = comment || '';
  req.approvals[roleIndex].decidedAt = new Date();
  req.approvals[roleIndex].approver  = user.id;
  req.status          = 'rejected';
  req.rejectionReason = comment || '';
  await req.save();

  await Notification.create({
    user:        req.requester._id,
    title:       'Requisition Rejected',
    message:     `${req.reqNumber} was rejected. Reason: ${comment || 'No reason given'}`,
    type:        'error',
    requisition: req._id,
    actionUrl:   `/requisitions/${req._id}`,
  });

  await sendMail({
    to:      req.requester.email,
    subject: `❌ ${req.reqNumber} — Rejected`,
    html: `
      <div style="font-family:Sora,sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#E84545">Requisition Rejected</h2>
        <p>Dear ${req.requester.name},</p>
        <p>
          Your requisition <strong>${req.reqNumber}</strong>
          has been <strong style="color:#E84545">rejected</strong>.
        </p>
        <p>
          <strong>Reason:</strong>
          ${comment || 'No reason provided'}
        </p>
        <p>Please review the feedback and resubmit if necessary.</p>
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/requisitions/${req._id}"
          style="display:inline-block;background:#E84545;color:#fff;
                 padding:12px 24px;border-radius:8px;font-weight:700;
                 text-decoration:none;margin-top:16px"
        >
          View Requisition
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px">
          KSU Procurement System — Kaduna State University
        </p>
      </div>
    `,
  });

  await AuditLog.create({
    requisition: req._id,
    user:        user.id,
    action:      `REJECTED_BY_${user.role.toUpperCase()}`,
    details:     comment || 'Rejected',
  });

  return populateRequisition(reqId);
}; 
