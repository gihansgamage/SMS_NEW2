import { SocietyRegistration } from '../types';

export const generateApplicationPDF = (formData: Partial<SocietyRegistration>) => {
  const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0;
      font-size: 24px;
    }
    .header h2 {
      color: #3b82f6;
      margin: 5px 0;
      font-size: 18px;
    }
    .section {
      margin: 25px 0;
      padding: 20px;
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .field {
      margin: 10px 0;
      display: flex;
    }
    .field-label {
      font-weight: bold;
      min-width: 180px;
      color: #475569;
    }
    .field-value {
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 10px;
      text-align: left;
    }
    th {
      background: #e0e7ff;
      color: #1e40af;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #f1f5f9;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #cbd5e1;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>University of Peradeniya</h1>
    <h2>Society Management System</h2>
    <h2>Society Registration Application</h2>
    <p style="margin-top: 15px; font-size: 14px; color: #64748b;">
      Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
    </p>
  </div>

  <div class="section">
    <div class="section-title">Applicant Information</div>
    <div class="field">
      <span class="field-label">Full Name:</span>
      <span class="field-value">${formData.applicantFullName || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Registration Number:</span>
      <span class="field-value">${formData.applicantRegNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.applicantEmail || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Faculty:</span>
      <span class="field-value">${formData.applicantFaculty || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Mobile:</span>
      <span class="field-value">${formData.applicantMobile || '-'}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Society Information</div>
    <div class="field">
      <span class="field-label">Society Name:</span>
      <span class="field-value">${formData.societyName || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">AGM Date:</span>
      <span class="field-value">${formData.agmDate || '-'}</span>
    </div>
    ${formData.bankAccount ? `
    <div class="field">
      <span class="field-label">Bank Account:</span>
      <span class="field-value">${formData.bankAccount}</span>
    </div>
    <div class="field">
      <span class="field-label">Bank Name:</span>
      <span class="field-value">${formData.bankName || '-'}</span>
    </div>
    ` : ''}
    ${formData.aims ? `
    <div class="field">
      <span class="field-label">Aims & Objectives:</span>
      <span class="field-value">${formData.aims}</span>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <div class="section-title">Senior Treasurer</div>
    <div class="field">
      <span class="field-label">Title:</span>
      <span class="field-value">${formData.seniorTreasurer?.title || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Full Name:</span>
      <span class="field-value">${formData.seniorTreasurer?.name || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Designation:</span>
      <span class="field-value">${formData.seniorTreasurer?.designation || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Department:</span>
      <span class="field-value">${formData.seniorTreasurer?.department || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.seniorTreasurer?.email || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Mobile:</span>
      <span class="field-value">${formData.seniorTreasurer?.mobile || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Address:</span>
      <span class="field-value">${formData.seniorTreasurer?.address || '-'}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Society Officials</div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">President</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.president?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.president?.name || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.president?.email || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Mobile:</span>
      <span class="field-value">${formData.president?.mobile || '-'}</span>
    </div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">Vice President</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.vicePresident?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.vicePresident?.name || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.vicePresident?.email || '-'}</span>
    </div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">Secretary</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.secretary?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.secretary?.name || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.secretary?.email || '-'}</span>
    </div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">Joint Secretary</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.jointSecretary?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.jointSecretary?.name || '-'}</span>
    </div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">Junior Treasurer</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.juniorTreasurer?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.juniorTreasurer?.name || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Email:</span>
      <span class="field-value">${formData.juniorTreasurer?.email || '-'}</span>
    </div>

    <h4 style="color: #1e40af; margin: 15px 0 10px 0;">Editor</h4>
    <div class="field">
      <span class="field-label">Reg No:</span>
      <span class="field-value">${formData.editor?.regNo || '-'}</span>
    </div>
    <div class="field">
      <span class="field-label">Name:</span>
      <span class="field-value">${formData.editor?.name || '-'}</span>
    </div>
  </div>

  ${formData.advisoryBoard && formData.advisoryBoard.length > 0 ? `
  <div class="section">
    <div class="section-title">Advisory Board Members (${formData.advisoryBoard.length})</div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Designation</th>
          <th>Department</th>
        </tr>
      </thead>
      <tbody>
        ${formData.advisoryBoard.map(member => `
          <tr>
            <td>${member.name || '-'}</td>
            <td>${member.designation || '-'}</td>
            <td>${member.department || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${formData.committeeMember && formData.committeeMember.length > 0 ? `
  <div class="section">
    <div class="section-title">Committee Members (${formData.committeeMember.length})</div>
    <table>
      <thead>
        <tr>
          <th>Registration Number</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        ${formData.committeeMember.map(member => `
          <tr>
            <td>${member.regNo || '-'}</td>
            <td>${member.name || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${formData.member && formData.member.length > 0 ? `
  <div class="section">
    <div class="section-title">General Members (${formData.member.length})</div>
    <table>
      <thead>
        <tr>
          <th>Registration Number</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        ${formData.member.map(member => `
          <tr>
            <td>${member.regNo || '-'}</td>
            <td>${member.name || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${formData.planningEvents && formData.planningEvents.length > 0 ? `
  <div class="section">
    <div class="section-title">Planning Events (${formData.planningEvents.length})</div>
    <table>
      <thead>
        <tr>
          <th>Month/Date</th>
          <th>Activity</th>
        </tr>
      </thead>
      <tbody>
        ${formData.planningEvents.map(event => `
          <tr>
            <td>${event.date || event.month || '-'}</td>
            <td>${event.activity || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>University of Peradeniya - Society Management System</strong></p>
    <p>Student Service Division | studentservice@pdn.ac.lk | +94 81 2393301</p>
    <p>University of Peradeniya, Kandy, Sri Lanka</p>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  } else {
    alert('Please allow pop-ups to download the PDF');
  }
};
