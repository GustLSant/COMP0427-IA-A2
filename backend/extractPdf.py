# import io
# from PyPDF2 import PdfReader
# from pdf2image import convert_from_bytes
# import pytesseract

# def extract_text_from_pdf(pdf_content):
#     pdf_stream = io.BytesIO(pdf_content)
#     reader = PdfReader(pdf_stream)
#     text_parts = []
    
#     # Convert all pages to images once to avoid doing it again later
#     images = convert_from_bytes(pdf_content)
    
#     for i, page in enumerate(reader.pages):
#         page_text = page.extract_text()
        
#         if page_text and page_text.strip():
#             text_parts.append(f"\n\n--- Page {i + 1} (text) ---\n{page_text.strip()}")
#         else:
#             # Fallback to OCR for this page
#             ocr_text = pytesseract.image_to_string(images[i])
#             text_parts.append(f"\n\n--- Page {i + 1} (OCR) ---\n{ocr_text.strip()}")
    
#     return '\n'.join(text_parts)

import fitz  # PyMuPDF

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extrai texto de um arquivo PDF a partir de bytes."""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        return "\n".join([page.get_text() for page in doc])