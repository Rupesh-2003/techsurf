import React, { useEffect, useState } from 'react'


const EditPhoto = (props) => {
    const [open, setOpen] = useState(props.open)

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

    return (
        <>
            <div
                className={`flex flex-row py-[22px] px-[35px] box-border text-[16px] border-b-[1px] border-gray cursor-pointer ${open && 'bg-[#FAFAFA] text-purple-dark font-medium'}`}
                onClick={onClickHanlder}
            >
                Edit Photo
                <img 
                    src='/icons/arrow.svg' 
                    className={`ml-auto transform transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}  
                />
            </div>
            <div
                className={`flex flex-row flex-wrap gap-x-[30px] gap-y-[22px] overflow-hidden transition-height duration-800 ease-in-out box-border text-[14px] text-[#253143] items-start
                ${open ? 'h-auto py-[22px] px-[35px] border-b-[1px] border-gray' : 'h-[0]'}`}
            >

                
            </div>
        </>
    )
}

export default EditPhoto