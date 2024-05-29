import { Slider } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners'


const Optimise = (props) => {
    const [open, setOpen] = useState(props.open)
    const [optimisePercentage, setOptimisePercentage] = useState(50)
    const [image, setImage] = useState(props.image.file)
    const [loading, setLoading] = useState(false)

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

    const onCompressClickHandler = () => {
        if (optimisePercentage == 0) {
            return
        }

        setLoading(true)
        var formdata = new FormData();
        formdata.append("image", image, image.name);
        formdata.append("quality", (100 - optimisePercentage))
        formdata.append("desired_size", Math.round((image.size - image.size*optimisePercentage/100)/1024))

        var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        };

        fetch("http://localhost:5001/compressImage", requestOptions)
        .then(response => response.blob())
        .then(blob => {
            const compressedImage = new File([blob], image.name, { type: blob.type });
            // console.log("Compressed image:", compressedImage);

            const updatedFileList = props.images.map((file, i) => {
                if (i === props.index) {
                    return {
                        file: compressedImage,
                        tags: file.tags,
                        caption: file.caption
                    };
                }
                return file;
            });
            props.setSelectedImages(updatedFileList);
            setLoading(false);
        })
        .catch(error => console.log('error', error));
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
                    <Slider value={optimisePercentage} onChange={(e) => {setOptimisePercentage(Math.round(e.target.value))}} size="md" color='deep-purple' />
                </div>

                {/* dotted line with dash gap of 5 px */} 
                
                <div className="h-1 w-full border-t-[2px] border-gray border-dashed border-spacing-[5px] mt-[25px]"></div>

                <div className="flex flex-row w-full">
                    <div className=''>Estimated Reduced Size</div>
                    <div className='ml-auto'>{Math.round((image.size - image.size*optimisePercentage/100)/1024)} KB</div>
                </div>

                {loading ? 
                    <div className='flex justify-center items-center w-[120px] h-[41px]'>
                        <ScaleLoader color='#7C3AED' radius={2} margin={2} />
                    </div>
                :
                
                    <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px]'
                        onClick={onCompressClickHandler}
                    >
                        Compress File
                        <img src='/icons/whiteArrow.svg'/>
                    </button>
                }               
            </div>
        </>
    )
}

export default Optimise