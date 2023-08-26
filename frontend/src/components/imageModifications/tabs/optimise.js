import { Slider } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'


const Optimise = (props) => {
    const [open, setOpen] = useState(props.open)
    const [optimisePercentage, setOptimisePercentage] = useState(50)
    const [image, setImage] = useState(props.image.file)

    useEffect(() => {
        setOpen(props.open)
        setImage(props.image.file)
    }, [props])

    const onClickHanlder = () => {
        if (open) {
            props.setTabOpened(false)
        }
        else {
            props.setTabOpened("optimise")
        }
    }

    return (
        <>
            <div
                className={`flex flex-row py-[22px] px-[35px] box-border text-[16px] border-b-[1px] border-gray cursor-pointer ${open && 'bg-[#FAFAFA] text-purple-dark font-medium'}`}
                onClick={onClickHanlder}
            >
                Optimise
                <img 
                    src='/icons/arrow.svg' 
                    className={`ml-auto transform transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}  
                />
            </div>
            <div
                className={`flex flex-col gap-y-[22px] overflow-hidden transition-height duration-800 ease-in-out box-border text-[14px] text-[#253143] items-start
                ${open ? 'h-auto py-[22px] px-[35px] border-b-[1px] border-gray' : 'h-[0]'}`}
            >
                <div className="flex flex-row w-full">
                    <div className=''>Compression</div>
                    <div className='ml-auto'>{optimisePercentage} %</div>
                </div>

                <div className="w-96">
                    <Slider value={optimisePercentage} onChange={(e) => {setOptimisePercentage(Math.round(e.target.value))}} size="md" color='deep-purple' defaultValue={50} />
                </div>

                {/* dotted line with dash gap of 5 px */} 
                
                <div className="h-1 w-full border-t-[2px] border-gray border-dashed border-spacing-[5px] mt-[25px]"></div>

                <div className="flex flex-row w-full">
                    <div className=''>Estimated Reduced Size</div>
                    <div className='ml-auto'>{Math.round((image.size - image.size*optimisePercentage/100)/1024)} KB</div>
                </div>
                
                <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px]'>
                    Compress File
                    <img src='/icons/whiteArrow.svg'/>
                </button>
                
            </div>
        </>
    )
}

export default Optimise