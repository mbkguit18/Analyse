import Versions from './components/Versions'
import icons from './assets/icons.svg'
import { FileSpreadsheet, LifeBuoy, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from './components/button';
import { Input } from './components/input';
import { Separator } from './components/separator';
//import { electron } from 'process';

function App(): JSX.Element {
  const [file,setFile]=useState<string|null>("");
  const [dir,setDir]=useState<string>("");
  
  const dragOverHandler=(event)=>{
    event.preventDefault();
    console.log("File in DropZone")
  }
 const dropHandler=(event)=>{
    if (event.dataTransfer.items){
      [...event.dataTransfer.items].forEach((item)=>{
        if (item.kind==='file'){
          const file=item.getAsFile()
          if(file.name.endsWith(".xlsx"))
          {
            setFile(file.path)
          }
          else{
            console.error("... invalide file")
          }
        }else{
          [...event.dataTransfer.files].forEach((file)=>{
            if(file.name.endsWith(".xlsx"))
          {
            setFile(file.path)
          }
          else{
            console.error("... invalide file")
          }
          })
          
        }
      })
    }
 }
 const handleFileSelection=async()=>{
   const dialogConfig={
    title:"Selectionner un Fichier Excel",
    buttonLabel:'Selectionner Svp',
    properties:['openFile'],
    filters:[{name:'Fichier Excel',extensions:['xlsx']}]
   }
   //@ts-ignore
   electron.ipcRenderer.send("openDialog",dialogConfig)
   //@ts-ignore
   electron.ipcRenderer.on('dialogResponse',(event,filePath)=>{
    setFile(filePath[0])
   })
 }
 const handelDirSelection=async()=>{
  const dialogConfig={
    title:"Selectionner un Fichier Excel",
    buttonLabel:'Selectionner Svp',
    properties:['openFile'],
    filters:[{name:'Fichier Excel',extensions:['xlsx']}]
   }
   //@ts-ignore
   electron.ipcRenderer.send("openDialog",dialogConfig)
   //@ts-ignore
   electron.ipcRenderer.on('dialogResponse',(event,filePath)=>{
    setDir(filePath[0])
   })
 }
 const handelApply = () => {
  console.log('first')
  //@ts-ignore
  electron.ipcRenderer.send('Transform', {
    file,
    dir
  })
}
  return (
    <div className="w-[50rem] bg-white rounded-lg">
      <div className='p-5 flex flex-col gap-6'>
        <h1 className='text-2xl'>Raport generator</h1>
        <div>
        <div id='drop-zone' className='border-2 rounded-xl border-dashed border-blue-500 bg-blue-50 flex flex-col justify-center items-center gap-4 p-4'
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
        >
          <Upload/>
          <p>Drag and Drop here or <span className='font-bold underline cursor-pointer' onClick={handleFileSelection}>Choose a File</span> to upload</p>
          <span>Only xlsx files</span>
        </div>
      </div>
      </div>
      {file && (
          <div className="flex justify-between">
            <div className="flex gap-4 text-[#42f57e]">
              <FileSpreadsheet color="#42f57e" />
              <span>{file?.split('\\').pop()}</span>
            </div>
            <X onClick={() => setFile(null)} className=" cursor-pointer" />
          </div>
        )}

        <Separator className="bg-gray-300 w-1/2 self-center" />
        <div className="flex gap-4">
          <Input
            placeholder="File destination"
            className=""
            value={dir}
            onChange={(e) => setDir(e.target.value)}
          />
          <Button
            className=" bg-blue-500 text-white w-fit whitespace-nowrap"
            onClick={handelDirSelection}
          >
            Choose file dest
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <LifeBuoy />
            <span>Help center</span>
          </div>
          <div className="flex gap-4 items-center">
            <Button className=" bg-white border border-gray-300 w-fit whitespace-nowrap">
              Cancel
            </Button>
            <Button
              className=" bg-blue-500 text-white w-fit whitespace-nowrap"
              onClick={handelApply}
            >
              Apply
            </Button>
          </div>
        </div>
    </div>
  )
}

export default App
