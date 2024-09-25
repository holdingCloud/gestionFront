import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
    title: string;
    content: string;
    open: boolean;
    onClose: (action: boolean) => void;
}

export const DialogModal = ({ title, content, open, onClose }: Props) => {


    return (

        <Dialog
            open={open}
            onClose={() => onClose(false)}
            aria-labelledby="draggable-dialog-title"

        >

            <Alert variant="filled" severity="warning">

                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus variant="contained" color="error" onClick={() => onClose(false)}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Alert>
        </Dialog>
    );
}
