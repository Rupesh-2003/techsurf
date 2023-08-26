import React, { useEffect, useState } from 'react'


const Convert = (props) => {
    const [open, setOpen] = useState(props.open)
    const [convertTo, setConvertTo] = useState('png')
    const [image, setImage] = useState(props.image.file)
    const [convertOptions, setConvertOptions] = useState([])

    useEffect(() => {
        setOpen(props.open)
        setImage(props.image.file)
        const options = ['png', 'jpeg', 'webp', 'jpg']
        const index = options.indexOf(image.type.split('/')[1])
        options.splice(index, 1)
        setConvertOptions(options)
    }, [props])

    const onClickHanlder = () => {
        if (open) {
            props.setTabOpened(false)
        }
        else {
            props.setTabOpened("convert")
        }
    }

    return (
        <>
            <div
                className={`flex flex-row py-[22px] px-[35px] box-border text-[16px] border-b-[1px] border-gray cursor-pointer ${open && 'bg-[#FAFAFA] text-purple-dark font-medium'}`}
                onClick={onClickHanlder}
            >
                Convert
                <img 
                    src='/icons/arrow.svg' 
                    className={`ml-auto transform transition-transform duration-500 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}  
                />
            </div>
            <div
                className={`flex flex-row flex-wrap gap-x-[30px] gap-y-[22px] overflow-hidden transition-height duration-800 ease-in-out box-border text-[14px] text-[#253143] items-start
                ${open ? 'h-auto py-[22px] px-[35px] border-b-[1px] border-gray' : 'h-[0]'}`}
            >

                <div className='flex flex-row gap-x-[30px] ml-auto mr-auto'>
                    <img src={`/icons/${image.type.split('/').pop()}Filled.svg`} className='cursor-pointer'/>
                    <div className="text-center w-[150px] border-t-[2px] border-gray border-dashed border-spacing-[5px] mt-[25px]">
                        convert to
                    </div>
                    <div className='flex flex-row gap-x-[20px]'>
                        {convertOptions.map((option) => {
                            return (
                                <img src={`/icons/${option}${convertTo == option ? 'Filled': ''}.svg`} onClick={() => setConvertTo(option)} className='cursor-pointer'/>
                            )
                        })}
                    </div>
                </div>

                <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px] mt-[20px]'>
                    Convert
                    <img src='/icons/whiteArrow.svg'/>
                </button>

            </div>
        </>
    )
}

export default Convert