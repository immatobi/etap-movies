import { Injectable } from '@nestjs/common';
import { MovieService } from '../movie/movie.service';
import { credentials, deleteGcFile, uploadBase64File } from '../../utils/gcs.util';
import { Storage } from '@google-cloud/storage';
import { IResult } from '../../utils/types.util';

@Injectable()
export class StorageService {

    public result: IResult;

    constructor(){

        this.result = {
            error: false,
            message: '',
            data: null,
            code: 200
        }
        
    }

    /**
     * @name getCredentitals
     * @returns bucketName, key, storage{class}
     */
    public async getCredentitals(): Promise<{ bucketName: string, key: string, storage: Storage }>{
        return credentials()
    }

    /**
     * @name uploadGcpFile
     * @param data 
     * @param filename 
     * @param type 
     * @returns 
     */
    public async uploadGcpFile(data: any, filename: string, type: string = 'base64'): Promise<IResult> {

        const allowed = ['base64', 'filedata'];

        // crash the app if proper type is not set
        if(!allowed.includes(type)){
            this.result.error = true;
            this.result.message = 'upload data type is invalid';
            this.result.data = null;
        }

        if(type === 'base64'){

            if(typeof(data) !== 'string'){

                this.result.error = true;
                this.result.message = 'data must be a string';
                this.result.data = null;

            }else{

                const mime = data.split(';base64')[0].split(':')[1];

                if(!mime || mime === '') {

                    this.result.error = true;
                    this.result.message = 'data is is expected to be base64 string'
                    this.result.data = null;

                }else{

                    // upload file
                    const fileData = {
                        file: data,
                        filename: `${filename}`,
                        mimeType: mime
                    }

                    const gData = await uploadBase64File(fileData);

                    this.result.error = false;
                    this.result.message = ''
                    this.result.data = gData;

                }

            }

        }

        return this.result;

    }

    /**
     * @name deleteGcpFile
     * @param filename 
     * @returns 
     */
    public async deleteGcpFile(filename: string): Promise<IResult>{

        if(filename === ''){
            this.result.error = true;
            this.result.message = 'file name is required for file deletion'
        }else{

            await deleteGcFile(filename);

        }

        return this.result;

    }

}
