import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { pageCalculator } from "./pageCalculator";
import { setUploadFiles } from '@/redux/uploadSlice'

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const PaperProductFileUpload = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [readMore, setReadMore] = useState(false);

  const [files, setFiles] = useState([]);
  const [filesDataForUpload, setFilesDataForUpload] = useState([]);
  const dropZoneRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const fileListRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (
        buttonContainerRef.current &&
        fileListRef.current &&
        dropZoneRef.current
      ) {
        const { bottom: buttonBottom, top: buttonTop } =
          buttonContainerRef.current.getBoundingClientRect();
        const { bottom: fileListBottom } =
          fileListRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const paperPolaroidsTop = document
          .querySelector("#paper-polaroids")
          ?.getBoundingClientRect().top;

        const hasReachedPolaroids = paperPolaroidsTop <= windowHeight;

        setIsSticky(
          buttonBottom < fileListBottom &&
          buttonBottom < windowHeight &&
          !hasReachedPolaroids
        );
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [files]);

  const handleFileChange = async (event) => {
    const filesInfoArray = Array.from(event.target.files);
    if (filesInfoArray.length > 0) {
      try {
        const returnData = await pageCalculator(filesInfoArray);
        if (returnData.success) {
          const data = returnData.files;
          setFiles((prevFiles) => [...prevFiles, ...data]);
          setFilesDataForUpload((prevFiles) => [...prevFiles, ...data]);
        }
      } catch (error) {
        console.error("Error in handleFileChange:", error);
      }
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files).map((file) => ({
      name: file.name,
      size: file.size,
      progress: 0,
      status: "pending",
    }));
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    setFiles([]);
  };

  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  const uploadFiles = async (filesToUpload) => {
    setLoading(true);
    try {
      const filesWithSubcategory = filesToUpload.map((file) => ({
        productname: files[0].name,
        fomat: files[0].format,
        pages: files[0].pages,
        size: files[0].size,
        progress: 100,
        status: "completed",
        category: params.category,
        subcategory: params.subcategory,
        name: params.name
      }));

      setFiles(filesWithSubcategory);

      dispatch(setUploadFiles(filesWithSubcategory));
      navigate('/upload-paper-product-details')
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };


  const handleFileUpload = async () => {
    if (files.length !== 0) {
      uploadFiles(filesDataForUpload);
    }
  };

  return (
    <div className="w-full max-w-[1280px] px-4 sm:px-20 p-6 relative">
      <h2 className="text-2xl font-bold mb-1">Upload Files</h2>
      <p className="text-sm text-gray-500 mb-4">Upload files required to print</p>
      <div
        ref={dropZoneRef}
        className={`border-2 flex flex-col justify-center items-center border-dashed rounded-lg p-8 mb-4 text-center h-[350px] transition-colors cursor-pointer ${isDragging
          ? "border-[#533d64] bg-[#e3befe]"
          : "border-[#533d64] bg-[#e3befe]"
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={handleDropZoneClick}
        role="button"
        tabIndex="0"
        aria-label="Drop zone for file upload"
      >
        <Upload
          className={`w-8 h-8 mx-auto mb-4 ${isDragging ? "text-green-600" : "text-green-500"
            }`}
        />
        <p className="mb-2">
          {isDragging
            ? "Drop files here"
            : "Click to upload or drag and drop file here."}
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf,.docx,.pptx"
          id="file-upload"
          ref={fileInputRef}
        />
      </div>
      <div className="flex flex-row text-xs justify-between text-gray-500 mb-4">
        <div className="flex items-center">
          <p className="hidden md:block">Supported file formats:</p> PDF, JPG, JPEG, PNG, DOCX, PPTX
        </div>
        <p>Maximum size: 100MB</p>
      </div>

      <div ref={fileListRef} className="space-y-[16px] mb-4">
        {files.map((file, index) => (
          <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-md shadow">
            <div className="flex flex-col w-full gap-[12px]">
              <div className="flex justify-between items-center ">
                <span className="text-sm font-semibold">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500"
                  disabled={loading}
                  aria-label={`Remove ${file.name}`}
                >
                  <div className="flex rounded-full p-1 border-[1.125px] border-gray-400">
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              </div>
              <Progress
                value={file.progress}
                max={100}
                className="bg-gray-600"
                aria-label={`${file.name} upload progress`}
              />
              <span className="text-xs text-gray-500">{file.size} | {file.pages} pages</span>
            </div>
          </div>
        ))}
      </div>

      <div ref={buttonContainerRef} className="flex justify-between">
        <Button
          variant="secondary"
          className="bg-[#de3939] text-white"
          onClick={clearQueue}
          disabled={loading}
        >
          Clear Queue
        </Button>
        <Button
          variant="primary"
          className="bg-[#533d64] text-white"
          onClick={handleFileUpload}
          disabled={files.length === 0 || loading}
        >
          {loading ? "Uploading..." : "Upload Files"}
        </Button>
      </div>

      <div className="py-10">
        <h2 className="text-xl sm:text-3xl py-2 font-bold text-slate-600">Print Documents</h2>
        <h3 className="text-slate-600 text-md">Lorem ipsum dolor sit amet. lorem Lorem, ipsum dolor.</h3>
        <p className="pt-5 pb-2 text-slate-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum animi nisi error incidunt esse deleniti eligendi fugit iure laboriosam beatae. Laborum suscipit quia aliquid amet doloribus. Et tempora adipisci labore quo! Tempora unde optio iste assumenda odit placeat excepturi, saepe, ipsa debitis voluptatibus eos rem nisi rerum, molestiae iusto! Libero! Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam debitis placeat, quaerat hic et incidunt. Dolores quia omnis eveniet labore, hic tempore?
          {
            !readMore && <button className="text-[#894fb6] px-2 hover:underline transition-all duration-300" onClick={() => setReadMore(!readMore)}>read more...</button>
          }
        </p>
        {
          readMore && <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia distinctio quaerat accusamus ea, sed similique error nam maxime iure, optio laboriosam voluptates, consequuntur totam corrupti rerum. Doloribus ab commodi ut architecto. Ab et suscipit vel veritatis reiciendis excepturi possimus dolores, minima accusamus officiis, molestiae nihil ratione aperiam officia impedit neque, enim deleniti libero inventore placeat iusto unde? Veritatis labore reprehenderit iste optio facere non atque obcaecati? Eos culpa labore assumenda sequi omnis ipsam delectus possimus inventore exercitationem dolore impedit laboriosam, excepturi quibusdam, temporibus itaque, expedita laborum fugit sint nam non sed voluptas id tenetur. Quaerat adipisci nam ut minima neque.

            <button className="text-[#894fb6]  px-2 hover:underline transition-all duration-300" onClick={() => setReadMore(!readMore)}>read less...</button>
          </p>
        }
      </div>
    </div>
  );
};

export default PaperProductFileUpload;
