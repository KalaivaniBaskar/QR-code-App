import { TextField , Grid, Paper, Button, Divider, Box, Typography} from '@mui/material'
import React, { useState } from 'react'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import BasicModal from './BasicModal';
import axios from 'axios';

const ScanQR = () => {
    const [value, setValue] = useState("");
    const [fileURL, setURL] = useState("");
    const [file, setFile] = useState("");
    const [ err, setErr] = useState("");
    const [ qrText, setQRTxt] = useState("");
    const [imgURL, setImgURL] = useState("")
    const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
    const maxFileSize = 1000000; // 1MB
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleMode = (e) => {
        setErr(""); 
        setFile("");
        setURL("");
        setImgURL("");
        setQRTxt("");
        setValue(e.target.value)
    }
    const handleImage = (e) => {
        setErr(""); 
        setFile("");
        setURL("");
        window.URL.revokeObjectURL(imgURL)
        setFileSizeExceeded(false);
        const file = e.target.files[0];
                if (file.size > maxFileSize) {
                    setFileSizeExceeded(true);
                    return; // do not process the file if it exceeds the size limit
                }
                else 
                {
                setFile(e.target.files[0])
            }
      } 

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        setFileSizeExceeded(false);
        setErr("");
        setQRTxt("");
        handleOpen();
        window.URL.revokeObjectURL(imgURL)
        if(value === 'upload') {
            if(!file) {
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            setImgURL( window.URL.createObjectURL(file))
            // POST request for file parameter
            try{
            const response = await axios.post("http://api.qrserver.com/v1/read-qr-code/", formData)
            console.log(response)
            if(response.status === 200) {
                const txt = response.data[0].symbol[0].data;
                if(!txt) {
                            setErr(response.data[0].symbol[0].error);
                            handleClose();
                            return;
                         }
                        setQRTxt(txt);
                        handleClose();
            }
           }
           catch(err){
            console.log(err)
                setErr("Couldn't scan QR Code");
                handleClose();
           }
            // await fetch("http://api.qrserver.com/v1/read-qr-code/", 
            // {   
            //     'method': 'POST', 
            //     body: formData
            // }).then(res => res.json()).then(result => {
            //     console.log(result);
            //     const txt = result[0].symbol[0].data;
            //     if(!txt) {
            //         setErr(result[0].symbol[0].error);
            //         handleClose();
            //         return;
            //      }
            //     setQRTxt(txt);
            //     handleClose();
            // }).catch((err) => {
            //     console.log(err)
            //     setErr("Couldn't scan QR Code");
            //     handleClose();
            // });
        }

        if(value === 'url') {
            const encodedurl = encodeURI(fileURL);
           // console.log(encodedurl)
            //----- using fetch to  GET --------- 
            await fetch(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodedurl}`, {
                method: 'GET'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Convert the response to a Blob
            })
            .then(res => {
                 //console.log("res", res)
                 const msg = res[0].symbol[0].data; 
                 if(msg) {
                    setQRTxt(msg);
                 }
                 else {
                    setErr(res[0].symbol[0].error)
                 }
                 handleClose();
            })
            .catch(error => {
                console.error("Error fetching image:", error);
                setErr("Couldn't scan QR Code");
                handleClose();
            });
        }
    } 
    const handleCopy = (e) => {
        const txt = e.target.value
        navigator.clipboard.writeText(txt);
    }
  return (
    <>
    <BasicModal open={open} handleClose={handleClose}></BasicModal>
    <Grid container className='scan' gap={2}
       sx={{background: 'transparent', paddingBlock: '100px'}}
       justifyContent={'center'}>
        <Grid item xs={11} sm={8}
        lg={6} xl={5} p={3}
        component={Paper}>
          <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Scan QR from</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={value}
                onChange={handleMode}
            >
                <FormControlLabel value="url" control={<Radio />} label="URL" />
                <FormControlLabel value="upload" control={<Radio />} label="Upload Image" />
            </RadioGroup>
            </FormControl>

            { (value === 'url') &&
            <TextField
            type='text'
            multiline
            variant='outlined'
            label="Enter QR image url"
            value={fileURL}
            fullWidth
            inputMode='text'
            onChange={(e)=> setURL(e.target.value)}
            sx={{marginBottom : '10px'}}
            required>
            </TextField>
             }
           {
            (value === 'upload') && 
            <TextField 
            type='file'
            variant='outlined'
            placeholder='Upload your QR code image file'
            onChange={handleImage}
            fullWidth
            required></TextField>
           }
            {
                err && 
                <p>{err}</p>
            }
            {
                fileSizeExceeded && 
                <p>File size should be less than 1MB</p>
            }
            <Button type='submit' variant='contained'
            sx={{marginBlock: '25px'}}>
             Scan QR
            </Button>
            </form> 
            
            { (file || fileURL) && 
                <div > 
                <Divider />
                <Typography variant='subtitle1' my={1}> QR code file scanned</Typography>
                <img src= { file ? imgURL : fileURL ? fileURL : "#"} alt="qr-code" /> 
                
                { qrText && 
                <div>
                <Typography variant='subtitle1' my={1} color="darkblue"
                sx={{padding : '8px', border: '1px solid grey', fontWeight: '550'}}
                >{qrText}</Typography> 
                
                
                 <Button variant="outlined" value={`${qrText}` }
                onClick={handleCopy}> Copy Text </Button> 
                </div> }
                </div> }
        </Grid>  
        </Grid>  
        </>
  )
}

export default ScanQR