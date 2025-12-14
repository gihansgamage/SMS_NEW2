package lk.ac.pdn.sms.service;

import lk.ac.pdn.sms.dto.SocietyRegistrationDto;
import lk.ac.pdn.sms.entity.SocietyRegistration;
import lk.ac.pdn.sms.entity.SocietyRenewal;
import lk.ac.pdn.sms.entity.EventPermission;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class PDFService {

    public byte[] generateRegistrationPDF(SocietyRegistration registration) throws IOException {
        return generatePDFContent(
                registration.getSocietyName(),
                registration.getApplicantFullName(),
                registration.getApplicantFaculty(),
                registration.getSeniorTreasurerFullName()
        );
    }

    public byte[] generateRegistrationPreviewPDF(SocietyRegistrationDto dto) throws IOException {
        return generatePDFContent(
                dto.getSocietyName(),
                dto.getApplicantFullName(),
                dto.getApplicantFaculty(),
                dto.getSeniorTreasurerFullName()
        );
    }

    private byte[] generatePDFContent(String societyName, String applicant, String faculty, String treasurer) {
        String content = String.format(
                "UNIVERSITY OF PERADENIYA\n" +
                        "STUDENT SERVICE DIVISION\n" +
                        "==========================================\n\n" +
                        "SOCIETY REGISTRATION APPLICATION\n\n" +
                        "Society Name: %s\n" +
                        "Faculty: %s\n" +
                        "Applicant: %s\n" +
                        "Senior Treasurer: %s\n\n" +
                        "==========================================\n" +
                        "This is a system generated application form.",
                societyName, faculty, applicant, treasurer
        );
        return content.getBytes(StandardCharsets.UTF_8);
    }

    public byte[] generateRenewalPDF(SocietyRenewal renewal) throws IOException {
        String pdfContent = "UNIVERSITY OF PERADENIYA\nSOCIETY RENEWAL\n" + renewal.getSocietyName();
        return pdfContent.getBytes(StandardCharsets.UTF_8);
    }

    public byte[] generateEventPermissionPDF(EventPermission event) throws IOException {
        String pdfContent = "UNIVERSITY OF PERADENIYA\nEVENT PERMISSION\n" + event.getEventName();
        return pdfContent.getBytes(StandardCharsets.UTF_8);
    }
}