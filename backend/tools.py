from fpdf import FPDF
from base64 import b64encode

def generate_pdf(content: str):
    base64_pdf_mime = "data:application/pdf;base64,"
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("helvetica", size=11)
    pdf.multi_cell(0, 10, content)

    pdf_bytes = pdf.output()
    base64_pdf = base64_pdf_mime + b64encode(pdf_bytes).decode("utf-8")
    return base64_pdf