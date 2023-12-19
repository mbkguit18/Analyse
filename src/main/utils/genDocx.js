import { Table } from 'docx'

const docx = require('docx')
const { Packer, Paragraph, TextRun, TableRow, TableCell } = docx

export async function genDocx(data, classes) {
  const tables = []
  const tableHeader = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph('الترتيب')]
      }),
      new TableCell({
        children: [new Paragraph('الفئة')]
      }),
      
      new TableCell({
        children: [new Paragraph('القيمة2')]
      }),
      
      new TableCell({
        children: [new Paragraph('القيمة1')]
      }),
      new TableCell({
        children: [new Paragraph('العبارة')]
      }),
      new TableCell({
        children: [new Paragraph('الرقم')]
      }),
      new TableCell({
        children: [new Paragraph('المخور')]
      }),
    ]
  })
  data.map((item) => {
    const Rows = []
    let avrage = 0
    let row1 = item[0]
    let row2 = item[1]
    Rows.push(tableHeader)
    let tabText=[];
    item.map((item1, index) => {
      if (item.length - 1 !== index) {
        tabText.push(new TextRun({text:`${index===0?"نلاحظ ان":"تاتي بعدها"} الفقرة ${item1.الرقم} "${item1.العبارة}" دات القيمة1 ${item1.القيمة1} ولقيمة2 ${item1.القيمة2} جاءت في المرتبة ${index+1} بدرجة ${item1.الفئة}`,break:1}))
        Rows.push(
          new docx.TableRow({
            children: [
              new TableCell({
                children: [new Paragraph((index+1).toString())]
              }),
              new TableCell({
                children: [new Paragraph("test")]
              }),
              new TableCell({
                children: [new Paragraph(item1.القيمة2.toFixed(2))]
              }),
              new TableCell({
                children: [new Paragraph(item1.القيمة1.toFixed(2))]
              }),
              new TableCell({
                children: [new Paragraph(item1.العبارة)]
              }),
              new TableCell({
                children: [new Paragraph(parseInt((item1.الرقم).toString()).toString())]
              }),
              new TableCell({
                children: [new Paragraph(item1.المخور)]
              }),
              
            ]
          })
        )
      } else {
        avrage = { number1: item1.المعدل.average1.toFixed(2),number2: item1.المعدل.average2.toFixed(2), class1: item1.المعدل.classe }
      tabText.push(new TextRun({text:`كما نلاحظ ام متوسط العبارات  ${avrage.class1}دو ${avrage.number1} و ${avrage.number2}`,break:1}))
        Rows.push(
          new docx.TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(item1.العنوان)],
                rowSpan: [3]
              }),
              new TableCell({
                children: [new Paragraph(item1.المعدل.average1.toFixed(2))]
              }),
              new TableCell({
                children: [new Paragraph(item1.المعدل.average2.toFixed(2))]
              }),
              new TableCell({
                children: [new Paragraph(item1.المعدل.classe)]
              })
            ]
          })
        )
      }
    })
    tables.push(new Table({ rows: Rows }))
    tables.push(
      new Paragraph({
        children: tabText
      })
    )
    // tables.push([
    //   new Table({ rows: Rows }),
    //   new Paragraph({
    //     children: new TextRun(`من خلال الجدول اعلاه نلاحض ان قيمة معدل جميع المتغيرات بلغت  `)
    //   })
    // ])
  })
  console.log(tables)
  const doc = new docx.Document({
    sections: [
      {
        children: tables
      }
    ]
  })

  const b64string = await Packer.toBase64String(doc)
  return b64string
}
