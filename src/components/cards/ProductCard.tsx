
import {
    CardContent,
    Tooltip,
    Fab,
    Avatar,
    Grid,
    Typography,
    Card,
    CardActions,
    Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { gestionApi } from "../../api/gestion.api";
import { useEffect, useState } from "react";

interface Props {
    name: string,
    description: string,
    quantity: number,
    img: string,
    code: string,
    handleOpen: () => void;
}



export const ProductCard = ({ name, description, img, quantity, code, handleOpen }: Props) => {

    const [productImage, setProductImage] = useState(`img`);

    const getImage = async (img: string) => {

        const { data } = await gestionApi.get<string>(`images/products/${img}`);
        setProductImage(data);
    }

    useEffect(() => {
        getImage(img);
    }, [])



    return (

        <Grid item xs={12} md={6} lg={3}>
            <Card

                sx={{
                    p: 0,
                    position: "relative",
                    padding: 2
                }}
                elevation={9}
                variant="elevation"
            >
                <Typography >
                    <Avatar
                        src={`data:image/jpeg;base64,${productImage}`} variant="rounded"
                        sx={{
                            height: '300px',
                            width: '500px',
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: "contain"
                        }}
                    />

                </Typography>
                <Tooltip title="Cantidad">

                    <Fab
                        size="small"
                        color="primary"
                        sx={{ bottom: "135px", right: "105px", position: "absolute" }}
                    >
                        {quantity}
                    </Fab>
                </Tooltip>
                <Tooltip title="Editar">

                    <Fab
                        size="small"
                        color="secondary"
                        sx={{ bottom: "135px", right: "60px", position: "absolute" }}
                    >
                        <EditIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Ver detalle">

                    <Fab
                        size="small"
                        color="info"
                        onClick={handleOpen}
                        sx={{ bottom: "135px", right: "15px", position: "absolute" }}
                    >
                        <VisibilityIcon />
                    </Fab>
                </Tooltip>
                <CardContent
                    sx={{
                        bgcolor: '#FFF',
                        borderRadius: 2,
                        borderColor: '#afaeae',
                    }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">{code}</Button>
                </CardActions>


            </Card>
        </Grid>
    )
}
