import * as React from 'react';
import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewTwoToneIcon from '@mui/icons-material/ArrowBackIosNewTwoTone';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, CardMedia, Container, Grid, } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
        editable: true,
    },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];


const data = [
    { label: 'Group A', value: 400 },
    { label: 'Group B', value: 300 },
    { label: 'Group C', value: 300 },
    { label: 'Group D', value: 200 },
];

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
    'Page A',
    'Page B',
    'Page C',
    'Page D',
    'Page E',
    'Page F',
    'Page G',
];

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
    onClose: () => void;
}

export const ProductPage = ({ open, onClose }: Props) => {


    return (

        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            transitionDuration={1000}

        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <ArrowBackIosNewTwoToneIcon />
                        <Typography style={{ cursor: "pointer" }} sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Cerrar
                        </Typography>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth={false}>

                <Box sx={{ flexGrow: 1 }}>
                    <Grid
                        sx={{ display: 'flex' }}
                        container>
                        <Grid
                            item
                            sx={{
                                bgcolor: '#FFF',
                                borderRadius: 2,
                                boxShadow: 10,
                                borderColor: '#ccc',
                                margin: 1,
                                padding: 5
                            }}
                            md={3} lg={3} xl={3}

                        >
                            <CardMedia
                                component="img"

                                sx={{
                                    width: 151,
                                    height: "100%"
                                }}
                                src='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=350&dpr=2'

                            />


                        </Grid>
                        <Grid
                            item
                            sx={{
                                bgcolor: '#FFF',
                                borderRadius: 2,
                                boxShadow: 10,
                                borderColor: '#ccc',
                                margin: 1,
                                padding: 5
                            }}
                            md={8.8} lg={8.8} xl={8.8}
                        >
                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid
                        sx={{ display: 'flex' }}
                        container>
                        <Grid
                            item
                            sx={{
                                bgcolor: '#FFF',
                                borderRadius: 2,
                                boxShadow: 10,
                                borderColor: '#ccc',
                                margin: 1,
                                padding: 5
                            }}
                            md={3} lg={3} xl={3}


                        >

                            <PieChart
                                series={[
                                    {
                                        paddingAngle: 5,
                                        innerRadius: 60,
                                        outerRadius: 80,
                                        data,
                                    },
                                ]}
                                margin={{ right: 5 }}
                                width={200}
                                height={200}
                            />


                        </Grid>
                        <Grid
                            item
                            sx={{
                                bgcolor: '#FFF',
                                borderRadius: 2,
                                boxShadow: 10,
                                borderColor: '#ccc',
                                margin: 1,
                                padding: 5
                            }}
                            md={8.8} lg={8.8} xl={8.8}

                        >
                            <LineChart

                                height={450}
                                series={[
                                    { data: pData, label: 'pv', yAxisKey: 'leftAxisId' },
                                    { data: uData, label: 'uv', yAxisKey: 'rightAxisId' },
                                ]}
                                xAxis={[{ scaleType: 'point', data: xLabels }]}
                                yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
                                rightAxis="rightAxisId"

                                margin={{ left: 100, right: 40, top: 50, bottom: 20 }}
                                grid={{ vertical: true, horizontal: true }}

                            />
                        </Grid>
                    </Grid>

                </Box>


            </Container>
        </Dialog>
    );
}

export default ProductPage;