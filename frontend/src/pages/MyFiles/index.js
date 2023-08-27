import ImageModifications from '@/components/imageModifications';
import React, { useState } from 'react';
import { ScaleLoader } from "react-spinners"

const MyFiles = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Function to handle file selection
    const handleFileSelect = (event) => {
        setLoading(true);
        const selectedFiles = Array.from(event.target.files);
    
        const imageFiles = selectedFiles.filter(file =>
            file.type.startsWith('image/')
        );
    
        const formdata = new FormData();
        imageFiles.forEach(file => {
            formdata.append('images', file);
        });
    
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };
    
        fetch("http://localhost:5000/getImageTags", requestOptions)
        .then(response => response.json())
        .then(result => {
            const updatedFileList = imageFiles.map(file => {
                const matchingResponse = result.data.find(responseObj => responseObj.image_filename === file.name);
                return {
                    file,
                    tags: matchingResponse ? matchingResponse.object_detection_labels : [],
                    caption: matchingResponse ? matchingResponse.image_captioning_output : ''
                };
            });
            setLoading(false);
            setSelectedImages(prevSelected => [...prevSelected, ...updatedFileList]);
        })
        .catch(error => {
            setLoading(false);
            console.log('error', error)
        });
        
    };
    

    const nextClickHandler = () => {
        if (index < selectedImages.length - 1) {
            setIndex(index + 1);
        }
    };

    const previousClickHandler = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return (
        <div className="flex flex-col h-screen relative font-Inter">
            <div className="flex flex-row min-h-[100px] p-[20px] items-start">
                My files &gt; marketing department

                <button className='flex flex-row gap-x-[10px] items-center outline-none text-purple-dark border-[1px] border-purple-dark font-semibold px-[22px] py-[10px] rounded-[5px] text-[14px] box-border ml-auto'>
                    Create
                    <img src='/icons/create.svg' alt='create logo'/>
                </button>

                <button 
                    className='outline-none text-white border-none bg-purple-dark font-semibold rounded-[5px] text-[14px] ml-[20px]'
                >
                    <label htmlFor='fileInput' className='cursor-pointer flex flex-row gap-x-[10px] items-center px-[22px] py-[10px] box-border'>
                        <div>
                            Upload
                        </div>

                        <img src='/icons/upload.svg' alt='upload logo'/>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        id="fileInput"
                        style={{ display: 'none' }}
                    />
                    
                </button>

                <div className='flex flex-row items-center gap-x-[5px] p-[8px] pr-[20px] border-[1px] border-gray cursor-pointer text-[14px] text-[#253143] font-medium rounded-[5px] box-border ml-[50px]'>
                    <img src='/icons/rupesh.jpg' className='w-[40px] h-[40px] rounded-full'/>
                    <div>Rupesh Raut</div>
                </div>
            </div>
            {selectedImages.length > 0 && 
                <ImageModifications 
                    images={selectedImages} 
                    index={index}
                    image={selectedImages[index]}
                    nextClickHandler={nextClickHandler}
                    previousClickHandler={previousClickHandler}
                    setSelectedImages={setSelectedImages}
                />
            }
            {loading && 
                <div className='flex flex-col gap-y-[10px] items-center justify-center m-auto text-[14px] text-[#606060]'>
                    <ScaleLoader  color='#7C3AED'/>
                    Hold on, we are processing your images
                </div>
            }
        </div>
    );
};

export default MyFiles;
