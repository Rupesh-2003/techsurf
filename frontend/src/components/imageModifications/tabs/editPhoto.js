import React, { useEffect, useState } from 'react'
import { Slider } from '@material-tailwind/react';


const EditPhoto = (props) => {
    const [open, setOpen] = useState(props.open)
    const [brightness, setBrightness] = useState(50);
    const [saturation, setSaturation] = useState(50);

    useEffect(() => {
        setOpen(props.open)
    }, [props])

    const onClickHanlder = () => {
        if (open) {
            props.setTabOpened(false)
        }
        else {
            props.setTabOpened("edit-photo")
        }
    }

    const applyEdits = () => {
        if(brightness > 50)
            props.applyEdits(brightness*2, saturation*2)
        else
            props.applyEdits(brightness, saturation)
    }

    return (
        <>
            {/* Tab header */}
            <div
                className={`flex flex-row py-[22px] px-[35px] box-border text-[16px] border-b-[1px] border-gray cursor-pointer ${
                    open && 'bg-[#FAFAFA] text-purple-dark font-medium'
                }`}
                onClick={onClickHanlder}
            >
                Edit Photo
                <img
                    src='/icons/arrow.svg'
                    className={`ml-auto transform transition-transform duration-500 ease-in-out ${
                        open ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </div>
            {/* Tab content */}

            <div
                className={`flex flex-col gap-y-[22px] overflow-hidden transition-height duration-800 ease-in-out box-border text-[14px] text-[#253143] items-start
                ${open ? 'h-auto py-[22px] px-[35px] border-b-[1px] border-gray' : 'h-[0]'}`}
            >
                <div className="flex flex-row w-full">
                    <div className=''>Brightness</div>
                    <div className='ml-auto'>{brightness} %</div>
                </div>

                <div className="w-96">
                    <Slider value={brightness} onChange={(e) => {setBrightness(Math.round(e.target.value))}} size="md" color='deep-purple' />
                </div>

                <div className="flex flex-row w-full">
                    <div className=''>Saturation</div>
                    <div className='ml-auto'>{saturation} %</div>
                </div>

                <div className="w-96">
                    <Slider value={saturation} onChange={(e) => {setSaturation(Math.round(e.target.value))}} size="md" color='deep-purple' />
                </div>

                {/* dotted line with dash gap of 5 px */} 
                
                <div className="h-1 w-full border-t-[2px] border-gray border-dashed border-spacing-[5px] mt-[25px]"></div>

                
                <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px]'
                    onClick={applyEdits}
                >
                    Edit Photo
                    <img src='/icons/whiteArrow.svg'/>
                </button>
                
            </div>

            {/*  */}
        </>
    );
}

export default EditPhoto