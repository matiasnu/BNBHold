import {InfluxDB} from '@influxdata/influxdb-client';
class Influx{
    constructor(){
        // You can generate a Token from the "Tokens Tab" in the UI
        const token = 'hrf_2_qx597SrGp6StMcmKF3F1gl8t0ayfqhPpoJmwKQ5k7mdiqVFFDbAeBoiTUA7nVkdPWzWBbrpR3tb3Irhw==';
        const org = 'matiasne45@gmail.com'
        const bucket = 'BNBHold'
        /**
        * Instantiate the InfluxDB client
         * with a configuration object.
         **/
        const client = new InfluxDB({url: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token})
        /**
         * Create a write client from the getWriteApi method.
         * Provide your `org` and `bucket`.
         **/
        this.writeApi = client.getWriteApi(org, bucket)
    }

    /**
     * Write in influxDB.
     **/
    writeData(point){
        /**
        * Setup default tags for all writes.
        **/
        this.writeApi.useDefaultTags({host: 'host1'})
        this.writeApi.writePoint(point)

        /**
         * Flush pending writes and close writeApi.
         **/
        this.writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('Finished ERROR')
        })

    }
}

export default Influx;











