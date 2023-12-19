export const group = (array: any, classes) => {
  const groupedObjects = {}
  array.forEach((obj) => {
    if (groupedObjects[obj.المخور]) {
      for (let i = 0; i < classes.length; i++) {
        //@ts-ignore
        if (obj.القيمة1 >= classes[i].from && obj.القيمة1 <= classes[i].to) {
          //@ts-ignore
          obj.الفئة = classes[i].remark
          break
        } else {
          obj.الفئة = null
        }
      }
      if (obj.القيمة1) groupedObjects[obj.المخور].push(obj)
    } else {
      groupedObjects[obj.المخور] = [obj]
      for (let i = 0; i < classes.length; i++) {
        //@ts-ignore
        if (obj.القيمة1 >= classes[i].from && obj.القيمة1 <= classes[i].to) {
          //@ts-ignore
          obj.الفئة = classes[i].remark
          break
        } else {
          obj.الفئة = "null"
        }
      }
    }
  })
  return Object.values(groupedObjects)
}

export const sort = (array, average) => {
  const sorted: any = []
  array.forEach((item, index) => {
    const sortedItem = item.sort((a, b) => {
      //@ts-ignore
      if (a.القيمة1 < b.القيمة1) {
        return 1
      }
      //@ts-ignore

      if (a.القيمة1 > b.القيمة1) {
        return -1
      }
      return 0
    })

    sortedItem.push({
      العنوان: 'المعدل للمحور',
      المعدل: average[index]
    })
    sorted.push(sortedItem)
    return sorted
  })
}

export const avrage = (array, classes) => {
  const averages: any = []
  array.forEach((subArray) => {
    const sum1 = subArray.reduce((total, obj) => total + obj['القيمة1'], 0)
    const sum2 = subArray.reduce((total, obj) => total + obj['القيمة2'], 0)
    const average1 = sum1 / subArray.length
    const average2 = sum2 / subArray.length
    let classe: any
    for (let i = 0; i < classes.length; i++) {
      //@ts-ignore
      if (average1 >= classes[i].from && average1 <= classes[i].to) {
        //@ts-ignore
        classe = classes[i].remark
        break
      } else {
        classe = null
      }
    }
    averages.push({ average1, average2, classe })
  })
  return averages
}
