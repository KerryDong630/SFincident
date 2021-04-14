import requestdev from '@/utils/request-dev'
import { post } from 'jquery'
export function uploadFile(file) {
    return requestdev({
        url: '/files',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data; charset=utf-8'
        },
        data: file
    })
}

export function getTemFile(file) {
    return requestdev({
        url: '/getFile/' + file,
        method: 'get',

    })
}
export function postTemFile(key,data) {
    return requestdev({
        url: "/fileTemp/"+key,
        method: 'post', 
        data
    })
}
export function getTemFileId(key) {
    return requestdev({
        url: "/fileTemp/"+key,
        method: 'get'
    
    })
}