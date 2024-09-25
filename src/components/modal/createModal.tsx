import { Slide } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface Props {
    title: string;
    open: boolean;
    onClose: (action: boolean) => void;
    children: any;
}

export const CreateModal = ({ title, open, onClose, children }: Props) => {


    return (

        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={() => onClose(false)}
            aria-labelledby="draggable-dialog-title"

        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {title}
            </DialogTitle>

            {children}


        </Dialog>
    );
}
