import { Observable } from 'rxjs';

let observable = Observable.create((observer: any) => {
    observer.next('Hello World!');
    observer.next('item 2');
    observer.complete();
    observer.next('This will not have any effect!!!');
});

observable.subscribe(
    (x: any) => logItem(x),
    (err: any) => logItem(err),
    () => logItem('Completed!')
)

function logItem(val: any) {
    let node = document.createElement('li');
    let textNode = document.createTextNode(val);
    node.appendChild(textNode)
    document.getElementById('list').appendChild(node);
}