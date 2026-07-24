export const generateLPOPDF = async (lpo) => {
      const PDFDocument = (await import('pdfkit')).default;
        const doc         = new PDFDocument({ margin: 50, size: 'A4' });

          const req    = lpo.requisition;
            const vendor = lpo.vendor;
              const dept   = req?.department;

                // ── Header ─────────────────────────────────────────────────
                  doc.fontSize(16).font('Helvetica-Bold')
                       .text('KADUNA STATE UNIVERSITY', { align: 'center' });
                         doc.fontSize(11).font('Helvetica')
                              .text('Kafanchan Road, Kaduna State, Nigeria', { align: 'center' });
                                doc.fontSize(11).text('Tel: 062-XXXXXXX | Email: procurement@ksu.edu.ng', { align: 'center' });

                                  doc.moveDown();
                                    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
                                      doc.moveDown();

                                        doc.fontSize(14).font('Helvetica-Bold')
                                             .text('LOCAL PURCHASE ORDER (LPO)', { align: 'center' });
                                               doc.moveDown(0.5);

                                                 // ── LPO Details ────────────────────────────────────────────
                                                   doc.fontSize(10).font('Helvetica');
                                                     const col1 = 50;
                                                       const col2 = 300;
                                                         let   y    = doc.y;

                                                           doc.text(`LPO Number: ${lpo.lpoNumber}`,        col1, y);
                                                             doc.text(`Date: ${new Date(lpo.createdAt).toLocaleDateString('en-NG')}`, col2, y);
                                                               y += 18;
                                                                 doc.text(`REQ Number: ${req?.reqNumber}`,        col1, y);
                                                                   doc.text(`Department: ${dept?.name}`,            col2, y);
                                                                     y += 18;
                                                                       doc.text(`Vendor: ${vendor?.name}`,              col1, y);
                                                                         doc.text(`Issued By: ${lpo.issuedBy?.name}`,     col2, y);
                                                                           y += 18;

                                                                             if (vendor?.address) {
                                                                                 doc.text(`Address: ${vendor.address}`, col1, y);
                                                                                     y += 18;
                                                                                       }

                                                                                         doc.moveDown(2);
                                                                                           doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
                                                                                             doc.moveDown();

                                                                                               // ── Items Table ────────────────────────────────────────────
                                                                                                 doc.fontSize(10).font('Helvetica-Bold');
                                                                                                   const headers = ['S/N', 'Description', 'Qty', 'Unit', 'Unit Price (₦)', 'Total (₦)'];
                                                                                                     const colW    = [30, 190, 40, 50, 100, 100];
                                                                                                       let   x       = 50;

                                                                                                         headers.forEach((h, i) => { doc.text(h, x, doc.y, { width: colW[i] }); x += colW[i]; });
                                                                                                           doc.moveDown(0.5);
                                                                                                             doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
                                                                                                               doc.moveDown(0.3);

                                                                                                                 doc.font('Helvetica');
                                                                                                                   req?.items?.forEach((item, idx) => {
                                                                                                                       x = 50;
                                                                                                                           const rowY = doc.y;
                                                                                                                               const vals = [
                                                                                                                                     `${idx + 1}`,
                                                                                                                                           item.description,
                                                                                                                                                 `${item.quantity}`,
                                                                                                                                                       item.unit,
                                                                                                                                                             Number(item.unitPrice).toLocaleString('en-NG'),
                                                                                                                                                                   Number(item.totalPrice).toLocaleString('en-NG'),
                                                                                                                                                                       ];
                                                                                                                                                                           vals.forEach((v, i) => {
                                                                                                                                                                                 doc.text(v, x, rowY, { width: colW[i] });
                                                                                                                                                                                       x += colW[i];
                                                                                                                                                                                           });
                                                                                                                                                                                               doc.moveDown(0.8);
                                                                                                                                                                                                 });

                                                                                                                                                                                                   doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
                                                                                                                                                                                                     doc.moveDown(0.5);
                                                                                                                                                                                                       doc.font('Helvetica-Bold').fontSize(11)
                                                                                                                                                                                                            .text(`TOTAL AMOUNT: ₦${Number(req?.totalAmount).toLocaleString('en-NG')}`, { align: 'right' });

                                                                                                                                                                                                              // ── Signatures ─────────────────────────────────────────────
                                                                                                                                                                                                                doc.moveDown(3);
                                                                                                                                                                                                                  const sigY = doc.y;
                                                                                                                                                                                                                    const sig  = [50, 210, 370];
                                                                                                                                                                                                                      const labs = ['Procurement Officer', 'Bursar / Finance', 'Vice Chancellor'];

                                                                                                                                                                                                                        sig.forEach((sx, i) => {
                                                                                                                                                                                                                            doc.moveTo(sx, sigY).lineTo(sx + 140, sigY).stroke();
                                                                                                                                                                                                                                doc.fontSize(9).font('Helvetica').text(labs[i], sx, sigY + 4, { width: 140, align: 'center' });
                                                                                                                                                                                                                                  });

                                                                                                                                                                                                                                    doc.end();
                                                                                                                                                                                                                                      return doc;
                                                                                                                                                                                                                                      };
