import * as application from "application";
import {Injectable} from '@angular/core';
import {SocketIO} from 'nativescript-socketio';
import {Config} from "../config";

@Injectable()
export class SocketClass {

    private static _socket:SocketIO = null
    private uuid:any = null;
    private xid:any = null;
    private bytes:any = null;
    private token:any = null;

    constructor() {
        global.tnsconsole.log('SocketClass > constructor')
    }

    getSocket():SocketIO {
        return SocketClass._socket
    }

    connect() {
        if (SocketClass._socket) {
            SocketClass._socket.connect()
        }
    }

    disconnect() {
        if (SocketClass._socket) {
            SocketClass._socket.disconnect()
        }
    }

    start() {
        global.tnsconsole.info('Socket > start')

        if (SocketClass._socket) {
            global.tnsconsole.error('SocketClass._socket > EXISTS')
            SocketClass._socket.connect()
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

        SocketClass._socket = new SocketIO(Config.socketUrl, opts)

        SocketClass._socket.on('connect', function (response) {
            global.tnsconsole.log('socket > connect')
        })

        SocketClass._socket.on('data', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > data', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > data', response)
            }
        })

        SocketClass._socket.on('disconnect', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > disconnect', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > disconnect', response)
            }
        })

        SocketClass._socket.on('reconnect_attempt', function (response) {
            if (application.ios) {
                global.tnsconsole.log('socket > reconnect_attempt', response.description)
            } else if (application.android) {
                global.tnsconsole.log('socket > reconnect_attempt', response)
            }
        })

        SocketClass._socket.on('error', function (error) {
            if (application.ios) {
                global.tnsconsole.error('socket > error', error.description)
            } else if (application.android) {
                global.tnsconsole.error('socket > error', error)
            }
        })

        SocketClass._socket.connect()
    }

    destroy() {
        if (SocketClass._socket) {
            SocketClass._socket.disconnect()
            if (application.ios) {
                SocketClass._socket.instance.removeAllHandlers()
            } else if (application.android) {
                SocketClass._socket.instance.close()
            }
            SocketClass._socket = null
            global.tnsconsole.warn('SocketClass._socket > DESTROYED')
        }
    }

}

export const SocketService:SocketClass = new SocketClass()