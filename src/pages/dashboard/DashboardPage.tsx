
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { BussinesCard, UrlBreadCrumbs } from '../../components';

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


export const DashboardPage = () => {



    return (
        <Grid
            sx={{ display: "flex" }}
            container
            rowSpacing={2}
            columnSpacing={2}>
            {/* row 1 */}
            <Grid item={true} xs={12} sx={{
                marginBottom: -50
            }} >
                <UrlBreadCrumbs />
            </Grid>

            <BussinesCard />

            <Grid item={true} xs={12} >
                <Typography variant="h5">Ventas</Typography>
            </Grid>

            <Grid
                sx={{
                    bgcolor: '#FFF',
                    borderRadius: 2,
                    boxShadow: 10,
                    borderColor: '#ccc',
                    height: '500px',
                    padding: 10,
                    margin: 2,
                }}
                item={true}
                xs={12} sm={12} md={12} lg={12}
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
    );
}

export default DashboardPage;