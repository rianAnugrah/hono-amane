
import { Bell, LocateIcon, User2 } from 'lucide-react'
import Badge from '../badge'

export default function TopBar() {


  return (
    <nav className=" relative z-20 ">
      <div className="w-full mx-auto px-4 ">
        <div className="flex justify-between h-16 items-center">
          <div className="flex gap-2 items-center">
           <div className='bg-amber-600 w-10 h-10 rounded-full p-2'>
            <User2 className=' text-white' />
           </div>
           <div className='flex flex-col gap-0'>
           <p className='  h-4 text-white text-lg flex items-center gap-2 mb-1'>Udin Jonathan <Badge text="Admin" color='green'/></p>
           <p className='  h-4 text-gray-300 text-xs flex items-center gap-1'><LocateIcon className='w-3' /> Surabaya</p>
           </div>
          </div>

          <div className="">
            <button
            //   onClick={() => setMenuOpen(true)}
              className="text-gray-300 hover:text-blue-600 text-2xl focus:outline-none border rounded-lg border-none p-2"
              aria-label="Open menu"
            >
              <Bell />
            </button>
          </div>
        </div>
      </div>

     
    </nav>
  )
}
