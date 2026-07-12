import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateReport(data: any) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("CareerGuardian AI", 20, 20);

  doc.setFontSize(14);
  doc.text("Recruitment Investigation Report", 20, 30);

  doc.setFontSize(12);

  doc.text(`Trust Score : ${data.verification.trustScore}%`,20,45);

  doc.text(`Verdict : ${data.verification.verdict}`,20,55);

  autoTable(doc,{
    startY:70,
    head:[["Layer","Status","Message"]],
    body:data.verification.layers.map((layer:any)=>[
      layer.title,
      layer.passed?"PASS":"FAIL",
      layer.message
    ])
  });

  doc.save("CareerGuardian_Report.pdf");
}