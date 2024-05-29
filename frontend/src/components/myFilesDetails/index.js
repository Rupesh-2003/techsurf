const MyFilesDetails = ({folders, files}) => {
    return (
        <div className="flex flex-col gap-y-[30px] flex-grow overflow-scroll p-[20px] items-start font-Inter">
            <div className="flex flex-col w-full gap-y-[20px]">
                <div className="font-medium">Folders</div>

                {folders?.map((folder, index) => (
                    <div className="flex flex-row flex-wrap gap-x-[25px] gap-y-[25px]" key={folder.name}>
                    <div className="flex flex-col gap-y-[17px] border-[1px] border-gray rounded-[10px] w-auto min-w-[250px] p-[16px] box-border cursor-pointer">
                        <div className="flex flex-row">
                            <div className="w-[40px] h-[40px] rounded-full bg-[#E9E4FD] flex justify-center items-center">
                                <img src="/icons/folder.svg" alt="folder" />
                            </div>
                            <img src="/icons/threedots.svg" alt="3dots" className="ml-auto mr-[20px]"/>
                        </div>
                        <div className="font-medium text-[16px] text-[#202020]">{folder.name}</div>
                    </div>

                </div>
                ))}
            </div>

            <div className="flex flex-col flex-grow w-full gap-y-[20px]">
                <div className="font-medium">Files</div>
                <div className="flex flex-row flex-wrap gap-x-[25px]  gap-y-[25px] cursor-pointer">
                {files?.length == 0 &&
                    <div className='flex flex-col items-center justify-center m-auto text-[14px] text-[#606060]'>
                        No Files Present, try uploading
                    </div>
                }
                {files?.map((file, index) => (
                    <div className="flex flex-col gap-y-[10px] p-[8px] bg-[#F3F6FB] w-[300px] h-[250px] box-border pt-[15px] rounded-[5px] text-[14px]" key={index}>
                        <div className="flex flex-row gap-[15px] items-center ">
                            <img src="/icons/image.svg" alt="image" className="w-[15px] h-[15px] ml-[10px]"/>
                            {file.name}
                        </div>
                        <a href={file.link} target="_blank" rel="noopener noreferrer" className="w-full h-full object-cover">
                            <img src={`https://lh3.googleusercontent.com/d/${file.imageId}`} className="w-full h-full object-cover" alt="file" />
                            
                            {/* alternate option */}
                            {/* <iframe 
                            src={`https://drive.google.com/file/d/${file.imageId}/preview`} 
                            className="w-full h-full object-cover" alt="file"
                            ></iframe> */}
                        </a>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default MyFilesDetails