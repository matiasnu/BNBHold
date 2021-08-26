import {InfluxDB} from '@influxdata/influxdb-client';
import configData from "../config/config.json";
class Influx{
    constructor(){
        // You can generate a Token from the "Tokens Tab" in the UI
        const token = configData.influx_db_token;
        const org = configData.influx_db_org;
        const bucket = configData.influx_db_bucket;
        const url = configData.influx_db_url;
        /**
        * Instantiate the InfluxDB client
         * with a configuration object.
         **/
        const client = new InfluxDB({url: url, token: token})
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











