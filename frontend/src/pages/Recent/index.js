import React, { useState, useEffect } from 'react'
import { ScaleLoader } from "react-spinners"

const Recent = () => {
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRecentImages = () => {
        setLoading(true);
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch("http://localhost:5001/recentImages", requestOptions)
            .then(response => response.json())
            .then(response => {
                setLoading(false);
                setImages(response)  
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        fetchRecentImages();
    }, []);

    console.log(images);

    return (
        <div className='flex items-start flex-grow p-[30px]'>
            {loading && 
            <div className='flex flex-col gap-y-[10px] items-center justify-center m-auto text-[14px] text-[#606060]'>
                <ScaleLoader color='#7C3AED' radius={2} margin={2} />
                Hold on, we are fetching your recent images
            </div>}

            {images !== null && images.length > 0 &&
                <div className="flex flex-col flex-grow w-full overflow-scroll gap-y-[20px] mt-[30px]">
                    <div className="font-medium">Recent Files</div>
                    <div className="flex flex-row flex-wrap gap-x-[25px] overflow-scroll gap-y-[25px] cursor-pointer">
                        {images?.map((image, index) => (
                            <div className="flex flex-col gap-y-[10px] p-[8px] bg-[#F3F6FB] w-[300px] h-[250px] box-border pt-[15px] rounded-[5px] text-[14px]">
                                <div className="flex flex-row gap-[15px] items-center ">
                                    <img src="/icons/image.svg" alt="image" className="w-[15px] h-[15px] ml-[10px]"/>
                                    {image.name}
                                    {console.log(image)}

                                </div>
                                <a href={`https://drive.google.com/uc?id=${image.file_id}`} target="_blank" rel="noopener noreferrer" className="w-full h-full object-cover">
                                    <img src={`https://lh3.googleusercontent.com/d/${image.file_id}`} className="w-full h-full object-cover" alt="file" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            }

            {images !== null && images.length === 0 &&
                <div className='flex flex-col items-center justify-center m-auto text-[14px] text-[#606060]'>
                    No Files Present, try uploading in the my files section
                </div>
            }
        </div>
    )
}

export default Recent