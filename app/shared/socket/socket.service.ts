import * as application from "application";
import {Injectable} from '@angular/core';
import {SocketIO} from 'nativescript-socketio';
import {Config} from "../config";

@Injectable()
export class SocketService {

    private static _socket:SocketIO = null
    private uuid:any = null;
    private xid:any = null;
    private bytes:any = null;
    private token:any = null;

    constructor() {
        global.tnsconsole.log('SocketService > constructor')
    }

    getSocket():SocketIO {
        return SocketService._socket
    }

    connect() {
        if (SocketService._socket) {
            SocketService._socket.connect()
        }
    }

    disconnect() {
        if (SocketService._socket) {
            SocketService._socket.disconnect()
        }
    }

    start() {
        global.tnsconsole.info('Socket > start')

        if (SocketService._socket) {
            global.tnsconsole.error('SocketService._socket > EXISTS')
            SocketService._socket.connect()
            return
        }

        let uuid:string = this.uuid
        let xid:string = this.xid
        let bytes:string = this.bytes
        let token:string = this.token

        if (!xid || !bytes || !token) {
            global.tnsconsole.error('!xid || !bytes || !token')
            return
        }
        let creds:string = JSON.stringify({uuid, xid, bytes, token, version: Config.socketVERSION})
        let opts:any = {
            path: '/socket',
            forcePolling: true,
        }
        if (application.ios) {
            opts.connectParams = ['creds', creds]
        } else if (application.android) {
            opts.query = 'creds=' + creds
        }

        SocketService._socket = new SocketIO(Config.socketUrl, opts)

        SocketService._socket.on('connect', function (response) {
            global.tnsconsole.log('socket > connect')
        })

        SocketService._socket.on('data', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > data', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > data', response)
            }
        })

        SocketService._socket.on('disconnect', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > disconnect', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > disconnect', response)
            }
        })

        SocketService._socket.on('reconnect_attempt', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > reconnect_attempt', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > reconnect_attempt', response)
            }
        })

        SocketService._socket.on('error', function (error) {
            if (application.ios) {
                global.tnsconsole.error('socket > error', error.description)
            } else if (application.android) {
                global.tnsconsole.error('socket > error', error)
            }
        })

        SocketService._socket.connect()
    }

    destroy() {
        if (SocketService._socket) {
            SocketService._socket.disconnect()
            if (application.ios) {
                SocketService._socket.instance.removeAllHandlers()
            } else if (application.android) {
                SocketService._socket.instance.close()
            }
            SocketService._socket = null
            global.tnsconsole.warn('SocketService._socket > DESTROYED')
        }
    }

}

//export const SocketService:SocketService = new SocketService()