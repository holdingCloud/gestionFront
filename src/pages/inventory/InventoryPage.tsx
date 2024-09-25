import { Box, Button, Container, FormControl, FormHelperText, Grid, Paper, TablePagination, TextField, Typography, styled } from "@mui/material";
import ProductPage from "./components/productPage";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useProductStore } from "../../store/product/product.store";
import { ChangeEvent, useEffect, useState, MouseEvent } from "react";
import { ProductCard, UrlBreadCrumbs } from "../../components";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { UploadService } from "../../services/upload.service";
import { useSnackbar } from "notistack";
import { useAuthStore } from "../../store";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export const InventoryPage = () => {

    const getProducts = useProductStore(state => state.getProducts);
    const products = useProductStore(state => state.products);
    const count = useProductStore(state => state.count);
    const createProduct = useProductStore(state => state.createProduct);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);
    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState<boolean>(false);
    const [skip, setSkip] = useState(0);

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        event?.preventDefault();
        setPage(newPage);
        setSkip(rowsPerPage * newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }

    const {
        handleSubmit, errors, touched, values, handleBlur, handleChange, setFieldValue
    } = useFormik({
        initialValues: {
            name: '',
            description: '',
            myFile: '',
            code: ''
        },
        onSubmit: async (values, { resetForm }) => {

            const { myFile, ...dataValue } = values;
            const file = await UploadService.uploadImage('products', myFile);
            const registerData = {
                ...dataValue,
                img: file.fileName,
                quantity: 0
            }
            createProduct(registerData);
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            resetForm();

        },
        validationSchema: Yup.object({
            name: Yup.string().max(15, 'Debe tener 15 caracteres o menos').required('Nombre de producto requerido'),
            description: Yup.string().max(30, 'Debe tener 15 caracteres o menos').required('Favor ingresar una descripción'),
            myFile: Yup.mixed().required('Debe adjuntar una imagen'),
            code: Yup.string().required('ingresar algun codigo de producto')
        })
    });



    useEffect(() => {
        getProducts(skip, rowsPerPage);
        checkAuthStatus();
    }, [page, rowsPerPage])


    return (
        <Container
            maxWidth={false} disableGutters
        >

            <UrlBreadCrumbs />

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    marginBottom: 2,
                    padding: 5
                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}>
                <Grid item={true} xs={12}
                    sx={{
                        marginTop: -3
                    }} >
                    <Typography color="text.primary"> Producto</Typography>
                    <Grid item={true} xs={12}
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            '& .MuiButton-root': { m: 2, width: '15ch' },
                        }}>

                        <TextField
                            fullWidth
                            name="name"
                            label="Nombre Producto"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name} />

                        <TextField
                            fullWidth
                            name="description"
                            label="descripción"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description} />


                        <TextField
                            fullWidth
                            name="code"
                            label="Codigo"
                            value={values.code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.code && Boolean(errors.code)}
                            helperText={touched.code && errors.code} />

                        <FormControl sx={{ width: '25ch' }}>
                            <Button
                                fullWidth
                                size="large"
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                            >
                                Imagen
                                <VisuallyHiddenInput
                                    type="file"
                                    name="myFile"
                                    onChange={(e) => {
                                        if (!e.currentTarget.files) return;
                                        setFieldValue('myFile', e.currentTarget.files[0]);
                                    }}
                                />
                            </Button>

                            <FormHelperText component="div">
                                {(errors.myFile) ? <Typography component="p" color="red">{errors.myFile}</Typography> : ""}</FormHelperText>
                        </FormControl>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary">
                            Guardar
                        </Button>

                    </Grid>
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    <Grid item
                        xs={12}
                        sm={12}
                        lg={2}>
                        <Item
                            sx={{
                                bgcolor: '#FFF',
                                borderRadius: 2,
                                boxShadow: 10,
                                borderColor: '#ccc',
                                marginBottom: 2,
                                padding: 2,
                            }}>
                            <Typography
                                sx={{
                                    padding: 2
                                }}
                            >Filtros</Typography>

                            <TextField
                                fullWidth
                                name="nombre"
                                label="nombre"
                                variant="filled"
                                size="small" />

                            <Button
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: 2

                                }}
                                variant="contained"
                                type="submit"
                                color="primary"
                                size="small">
                                Filtrar
                            </Button>

                            <Button
                                sx={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: 2
                                }}
                                variant="contained"
                                type="submit"
                                color="error"
                                size="small">
                                Limpiar
                            </Button>
                        </Item>
                    </Grid>
                    <Grid item lg={10} sm={12} xs={12}>
                        <Item sx={{
                            bgcolor: '#FFF',
                            borderRadius: 2,
                            boxShadow: 10,
                            borderColor: '#ccc',
                            marginBottom: 2,
                            padding: 2,
                        }}>



                            {
                                (products.length != 0) ? <>

                                    <Grid container spacing={5} columns={12} >

                                        {products.map((product) =>
                                        (

                                            <ProductCard {...product} key={product.id} handleOpen={handleOpen} />

                                        )
                                        )}


                                    </Grid>
                                    <TablePagination
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        component="div"
                                        count={count}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        rowsPerPage={rowsPerPage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={"Data por página"}
                                        labelDisplayedRows={(from) => `${from.from} - ${from.to} de ${from.count}`}
                                    />

                                    <ProductPage open={open} onClose={onClose} />
                                </>
                                    : <></>
                            }


                        </Item>
                    </Grid>
                </Grid>
            </Box>




        </Container>
    )
}

export default InventoryPage;


