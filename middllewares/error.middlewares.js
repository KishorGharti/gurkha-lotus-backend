import multer from 'multer'

export const errorMiddleware = (err,req,res,next)=>{
    if (err instanceof multer.MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be smaller than 15MB' : err.message
        return res.status(400).json({ success: false, message })
    }
    res.status(err.status||500).json({success:false, message:err.message||'Something went wrong'})
}