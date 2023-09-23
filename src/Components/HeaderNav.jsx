import React from 'react'
import QrCodeIcon from '@mui/icons-material/QrCode';
import { Button } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from 'react-router-dom';

const HeaderNav = () => { 

    const navigate = useNavigate();
  return (
     <div className='navbuttons'>
        <div onClick={() => navigate('/')}>
            <Button variant='outlined'
            sx={{color : 'white', borderColor: 'white'}} >
                Create 
                 <QrCodeIcon className='icon' 
                 sx={{paddingLeft: '5px'}}/>
            </Button> 
        </div>
        <div onClick={() => navigate('/scan')}>
            <Button variant='outlined'
             sx={{color : 'white', borderColor: 'white'}}>
                Scan 
                 <QrCodeScannerIcon 
                 className='icon'
                 sx={{paddingLeft: '5px'}} />
            </Button> 
        </div>
     </div>
  )
}

export default HeaderNav