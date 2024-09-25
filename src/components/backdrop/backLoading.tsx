import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

interface Props {
    action: boolean
}

export default function BackLoading({ action }: Props) {

    const [open, setOpen] = useState(action);

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setTimeout(() => {
            setOpen(false);
        }, 10000)
    }, [])


    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
