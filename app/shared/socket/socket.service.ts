import * as application from "application";
import {Injectable} from '@angular/core';
import {SocketIO} from 'nativescript-socketio';
import {Config} from "../config";

@Injectable()
export class SocketClass {

    private static _socket: SocketIO = null

    constructor(

    ) {
        console.log('SocketClass > constructor')
    }

    getSocket(): SocketIO {
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
        console.info('Socket > start')

        if (SocketClass._socket) {
            console.error('SocketClass._socket > EXISTS')
            SocketClass._socket.connect()
            return
        }

        let opts: any = {
            path: '/socket',
        }
        SocketClass._socket = new SocketIO( Config.socketUrl, opts)

        SocketClass._socket.on('connect', function(response) {
            console.log('socket > connect')
        })

        SocketClass._socket.on('data', function(response) {
            if (application.ios) {
                console.log('socket > data', response.description)
            } else if (application.android) {
                console.log('socket > data', response)
            }
        })

        SocketClass._socket.on('disconnect', function(response) {
            if (application.ios) {
                console.log('socket > disconnect', response.description)
            } else if (application.android) {
                console.log('socket > disconnect', response)
            }
        })

        SocketClass._socket.on('reconnect_attempt', function(response) {
            if (application.ios) {
                console.log('socket > reconnect_attempt', response.description)
            } else if (application.android) {
                console.log('socket > reconnect_attempt', response)
            }
        })

        SocketClass._socket.on('error', function(error) {
            if (application.ios) {
                console.error('socket > error', error.description)
            } else if (application.android) {
                console.error('socket > error', error)
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
            console.warn('SocketClass._socket > DESTROYED')
        }
    }

}

export const SocketService: SocketClass = new SocketClass()