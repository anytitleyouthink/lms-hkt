export const generateCertificateHTML = (
    studentName: string,
    courseName: string,
    issueDate: Date,
    certificateId: string
) => {
    const formattedDate = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(issueDate)

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chứng Nhận Hoàn Thành Khóa Học</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f4f8;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .certificate-container {
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
            border: 2px solid #d4af37;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            position: relative;
            padding: 40px;
            box-sizing: border-box;
            text-align: center;
            overflow: hidden;
        }

        .certificate-container::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 1px solid #d4af37;
            pointer-events: none;
        }

        .header {
            margin-bottom: 30px;
        }

        .logo {
            font-weight: 700;
            font-size: 24px;
            color: #2c3e50;
            letter-spacing: 2px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .title {
            font-size: 48px;
            font-family: 'Great Vibes', cursive;
            color: #d4af37;
            margin: 10px 0;
        }

        .subtitle {
            font-size: 16px;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 4px;
        }

        .content {
            margin: 40px 0;
        }

        .text-presented {
            font-size: 18px;
            color: #34495e;
            margin-bottom: 20px;
        }

        .student-name {
            font-size: 42px;
            font-weight: 700;
            color: #2c3e50;
            margin: 20px 0;
            border-bottom: 2px solid #e0e0e0;
            display: inline-block;
            padding-bottom: 5px;
            min-width: 400px;
        }

        .course-reason {
            font-size: 18px;
            color: #34495e;
            margin: 20px 0;
            line-height: 1.6;
        }

        .course-name {
            font-size: 24px;
            font-weight: 600;
            color: #2980b9;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding: 0 40px;
        }

        .signature-block {
            text-align: center;
            width: 200px;
        }

        .signature-line {
            border-top: 1px solid #7f8c8d;
            margin-bottom: 10px;
        }

        .signature-text {
            font-size: 14px;
            color: #7f8c8d;
        }

        .timestamp, .cert-id {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 5px;
        }

        .seal {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 2px dashed #d4af37;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #d4af37;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: rgba(212, 175, 55, 0.05);
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="header">
            <div class="logo">E-LEARNING ACADEMY</div>
            <h1 class="title">Chứng Nhận Hoàn Thành</h1>
            <div class="subtitle">Certificate of Completion</div>
        </div>

        <div class="content">
            <div class="text-presented">Chứng nhận này được trao cho</div>
            <div class="student-name">${studentName}</div>
            <div class="course-reason">
                Đã xuất sắc hoàn thành khóa học<br>
                <span class="course-name">${courseName}</span>
            </div>
        </div>

        <div class="footer">
            <div class="signature-block">
                <div class="signature-line" style="margin-bottom: 5px; ></div>
                <div class="signature-text">Ngày Cấp: ${formattedDate}</div>
            </div>
            
            <div class="seal">Official<br>Certified</div>

            <div class="signature-block">
                <div class="signature-line" style="margin-bottom: 5px;">
                  
                </div>
                <div class="signature-text">Ban Giám Đốc</div>
                <div class="cert-id">ID: ${certificateId}</div>
            </div>
        </div>
    </div>
</body>
</html>
  `
}
