import { Paper, TextField, 
    Grid, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material'
import React, { useState } from 'react'

const CreateQR = () => {
    const [data, setData] = useState("");
    const [size, setSize] = useState(100);
    const [color, setColor] = useState("#000000");
    const [bgcolor, setBGColor] = useState("#ffffff");
    const [format, setFormat] = useState("jpg");
    const [ err, setErr] = useState("");
    const [imgURL, setImgURL] = useState("")
   
    const handleSubmit = async(e) => {
        e.preventDefault();
        setImgURL("")
        if(size < 10 || size > 1000) {
            setErr('Dimension should be between 10px - 1000px')
        }
        else {
            setErr("")
            //const txt = data.replaceAll(" ","%20");
            const txt = encodeURI(data)
            // ------using API as direct URL -------------
            setImgURL(`https://api.qrserver.com/v1/create-qr-code/?data=${txt}&size=${size}x${size}&color=${color.substring(1)}&bgcolor=${bgcolor.substring(1)}&format=${format}`) 
        
            //----- using fetch to  GET --------- 
    // await fetch(`https://api.qrserver.com/v1/create-qr-code/?data=${txt}
    //             &size=${size}x${size}
    //             &color=$ {color.substring(1)}
    //             &bgcolor=${bgcolor.substring(1)}
    //             &format=${format}`)
    // .then(response => {
    //     if (!response.ok) {
    //         throw new Error("Network response was not ok");
    //     }
    //     return response.blob(); // Convert the response to a Blob
    // })
    // .then(blob => {
    //     // Create a URL for the Blob
    //     const imageUrl = URL.createObjectURL(blob);

    //     // Set the image source to the created URL
    //     setImgURL(imageUrl)
    // })
    // .catch(error => {
    //     console.error("Error fetching image:", error);
    // });
        }

    }

    const handleCopy = (e) => {
        const qrl = e.target.value
        //console.log(qrl)
        navigator.clipboard.writeText(qrl);
    }
  return (
    <>
      <Grid container className='create' gap={2}
       sx={{background: 'transparent', paddingBlock: '100px'}}
       justifyContent={'center'}>
        <Grid item xs={11} sm={8}
        lg={6} xl={5} p={3}
        component={Paper}>
          <form onSubmit={handleSubmit}>
            <TextField
            type='text'
            multiline
            variant='outlined'
            label="Enter your data"
            value={data}
            fullWidth
            inputMode='text'
            onChange={(e)=> setData(e.target.value)}
            sx={{marginBottom : '10px'}}
            required>
            </TextField>

            <TextField
            fullWidth
            type='number'
            variant='outlined'
            placeholder='Dimension range 10 to 1000'
            label='Dimension'
            sx={{marginBottom : '10px'}}
            value={size}
            onChange={(e)=> setSize(e.target.value)}
            required>
            </TextField>
            
            <TextField
            fullWidth
            type='color'
            value={color}
            variant='outlined'
            label='Pick QR Color'
            sx={{marginBottom : '10px'}}
            onChange={(e)=> setColor(e.target.value)}>
            </TextField>

            <TextField
            fullWidth
            value={bgcolor}
            type='color'
            variant='outlined'
            label='Pick QR background color'
            sx={{marginBottom : '10px'}}
            onChange={(e)=> setBGColor(e.target.value)}>
            </TextField>
            
            <InputLabel>Format</InputLabel>
            <Select
            value={format}
            onChange={(e)=> setFormat(e.target.value)}
            fullWidth>
                <MenuItem value={'jpg'}>JPG</MenuItem>
                <MenuItem value={'gif'}>GIF</MenuItem>
                <MenuItem value={'jpeg'}>JPEG</MenuItem>
                <MenuItem value={'svg'}>SVG</MenuItem>
                <MenuItem value={'png'}>PNG</MenuItem>
                <MenuItem value={'eps'}>EPS</MenuItem>
            </Select>
            
            {
                err && 
                <p>{err}</p>
            }
            <Button type='submit' variant='contained'
            sx={{marginBlock: '25px'}}>
             Create QR
            </Button>
            </form>
        </Grid>  
        
        <Grid item xs={11} sm={8}
        lg={6} xl={5} p={3}
        component={Paper}
        sx={{ justifyContent: 'center', maxHeight: '500px', alignItems: 'center', paddingBlock: '40px'}}>
        { imgURL && 
        <div className='qr-wrap'>
            <a href={imgURL} target="_blank" 
            rel="noopener noreferrer"
            download={`myqr.${format}`} >
            Download QR </a> 
            <Button variant="outlined" value={`${imgURL}` }
            onClick={handleCopy}> Copy QR code URL </Button>
            <img src= {imgURL} alt="qr-code" /> 
            </div> 
            }
        {
            !imgURL && 
            <Typography variant='h6'> Create your QR code</Typography>
        }
        </Grid>
      </Grid>
      
    </>
  )
}

export default CreateQR