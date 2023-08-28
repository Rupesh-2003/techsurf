import React, { useEffect, useState } from 'react'
import { ScaleLoader } from "react-spinners"

import AutoTagging from './tabs/autoTagging'
import EditPhoto from './tabs/editPhoto';
import Optimise from './tabs/optimise';
import Convert from './tabs/convert';

const ImageModifications = (props) => {
    const[tabOpened, setTabOpened] = useState(null);  // auto-tagging, edit-photo, optimise, convert
    const [image, setImage] = useState(props.image)
    const [images, setImages] = useState(props.images)
    const [saving, setSaving] = useState(false); 

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    const saveButtonClickHandler = () => {
        setSaving(true);
        var formdata = new FormData();
        formdata.append("image", image.file, image.file.name);
        formdata.append("caption", image.caption);
        formdata.append("tags", image.tags.join(' '));

        var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        };

        fetch("http://localhost:5000/saveImageToGoogleDrive", requestOptions)
        .then(response => {
            setSaving(false);
            // remove this image from the list of images
            const updatedImages = images.filter((img, idx) => idx !== props.index);
            props.setSelectedImages(updatedImages);
            if(updatedImages.length === 0) {
                props.fetchFiles();
            }
        })
        .catch(error => console.log('error', error));
    }

    const applyEdits = (brightness, saturation) => {
        const editedImage = new Image();
        editedImage.src = URL.createObjectURL(image.file);
        editedImage.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = editedImage.width;
            canvas.height = editedImage.height;

            // Apply edits using CSS filters
            ctx.filter = `brightness(${brightness}%) saturate(${saturation}%)`;
            ctx.drawImage(editedImage, 0, 0);

            // Convert edited canvas to a Blob
            canvas.toBlob((blob) => {
                const editedFile = new File([blob], image.file.name, {
                    type: image.file.type,
                    lastModified: image.file.lastModified,
                });

                // Update the image state with the edited file
                setImage({
                    ...image,
                    file: editedFile,
                });

                // Update the selected images state with the edited file
                const updatedFileList = images.map((file, i) => {
                    if (i === props.index) {
                        return {
                            file: editedFile,
                            tags: file.tags,
                            caption: file.caption
                        };
                    }
                    return file;
                });
                props.setSelectedImages(updatedFileList);
            }, image.file.type);
        };
    };

    useEffect(() => {
        setImage(props.image)
        setImages(props.images)
    }, [props])

    const downloadImageClickHandler = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(image.file);
        a.download = image.file.name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-grow flex-row relative font-Inter">
            <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2 mt-[-35px] ml-[-80px] text-[14px] font-medium'>
               <img src='/icons/directionArrow.svg' className='mr-[6px]'/>
                <div className='mr-[10px] cursor-pointer'
                    onClick={props.previousClickHandler}
                >
                    Previous
                </div>
                <div className='text-purple-dark font-semibold w-[30px] text-center'>{props.index +1}/{images.length}</div>
                <div className='ml-[10px] cursor-pointer'
                    onClick={props.nextClickHandler}
                >
                    Next
                </div>
                <img src='/icons/directionArrow.svg' className='ml-[6px] transform transition-transform duration-500 ease-in-out rotate-180'/>
            </div>
            <div className="flex flex-col min-w-[43%] border-r-[1px] border-gray">
                <div className="flex flex-col">
                    <AutoTagging 
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'auto-tagging'}
                        image={image}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />

                    <EditPhoto
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'edit-photo'}
                        applyEdits={applyEdits}
                    />

                    <Optimise
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'optimise'}
                        image={image}
                        images={images}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />

                    <Convert
                        setTabOpened={setTabOpened}
                        open={tabOpened === 'convert'}
                        image={image}
                        images={images}
                        index={props.index}
                        setSelectedImages={props.setSelectedImages}
                    />
                </div>
            </div>

            <div className='flex flex-col min-w-[57%] pb-[20px]'>
                {/* Image Information */}
                <div className='flex flex-row justify-between h-[138px] w-full border-b-[1px] border-gray p-[20px] text-[14px]'>
                    <div className='flex flex-col gap-y-[10px] w-[50%]'>
                        {/* col 1 */}
                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Name: </div>
                            <div>{image?.file.name.split('.')[0]}</div>
                        </div>

                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Size: </div>
                            <div>{(image?.file.size / 1024).toFixed(2)} KB</div>
                        </div>

                        <div className='flex flex-row'>
                            <div className='w-[70px] font-medium'>Format: </div>
                            <div>{image?.file.type.split('/').pop()}</div>
                        </div>
                    </div>
                    
                    {/* col 2 */}
                    <div className='flex flex-col w-[50%]'>
                        <div className='flex flex-row'>
                            <div className='min-w-[100px] font-medium'>Last Modified: </div>
                            <div className='pl-[5px]'>{formatDate(image?.file.lastModifiedDate)}</div>
                        </div>
                    </div>
                </div>

                {/* Image Preview */}
                <div className='flex flex-col flex-grow h-[calc(100vh-300px)] mb-[10px]'>
                    <div className='flex justify-center h-[95%] w-full p-[15px] pb-[5px] items-center object-contain'>
                        <img src={URL.createObjectURL(image.file)} className='max-h-full object-contain box-border'/>
                    </div>
                    <div className='flex justify-center text-[14px]'>
                        {image.caption}
                    </div>
                </div>

                {/* Buttons */}
                <div className='flex flex-row mt-auto h-auto px-[20px]'>
                    <button className='flex flex-row gap-x-[15px] items-center outline-none text-[#253142] bg-[#F1F1F1] border-[1px] border-gray font-medium px-[20px] py-[10px] rounded-[5px] text-[14px] box-border'
                        onClick={() => {props.onCancelClickHandler(props.index)}}
                    >
                        Cancel
                    </button>

                    <button className='flex flex-row gap-x-[15px] items-center outline-none text-purple-dark bg-purple-light border-[1px] border-purple-dark font-medium px-[20px] py-[10px] rounded-[5px] text-[14px] ml-auto box-border'
                        onClick={downloadImageClickHandler}
                    >
                        Download
                    </button>

                    {!saving ? 
                        <button className='flex flex-row gap-x-[15px] items-center border-none outline-none bg-purple-dark text-white font-medium px-[20px] py-[10px] rounded-[5px] ml-[20px] text-]14px] box-border'
                            onClick={saveButtonClickHandler}
                        >
                            <img src='/icons/save.svg'/>
                            save
                        </button>
                    :
                        <div className='w-[106px] flex justify-center items-center'>
                            <ScaleLoader color='#7C3AED' loading={saving} height={20} width={2} radius={2} margin={2} />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ImageModifications