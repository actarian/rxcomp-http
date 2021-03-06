import { Component, errors$, getContext, IFactoryMeta } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { HttpSerializerCodec, HttpService } from '../../../src/rxcomp-http';
import { IResponseData, ITodoItem } from './todo/todo';

export default class AppComponent extends Component {
	items: ITodoItem[] = [];
	error: any = null;
	onInit() {
		// console.log('AppComponent.onInit', this);
		const { node } = getContext(this);
		node.classList.add('init');
		/*
		const payload = { query: `{ hello }` };
		*/
		/*
		const payload = { query: `{ roll(dices: ${3}, sides: ${6}) }` };
		*/
		/*
		const payload = {
			query: `query ($dices: Int!, $sides: Int) {
			roll(dices: $dices, sides: $sides)
		}`, variables: { dices: 3, sides: 6 }
		};
		*/
		/*
		const payload = { query: `{ getTodos { id, title, completed } }` };
		*/
		/*
		HttpService.post$<IResponseData>(`${Vars.host}${Vars.api}`, payload, {
			params: { query: `{ getTodos { id, title, completed } }` },
			reportProgress: true
		}).pipe(
		*/
		/*
		const methodUrl: string = `${Vars.host}${Vars.api}`;
		HttpService.post$<IResponseData>(methodUrl, payload).pipe(
			first(),
		).subscribe((response: IResponseData) => {
			this.items = response.data.getTodos;
			this.pushChanges();
			// console.log('AppComponent.getTodos', this.items);
		}, error => console.log);
		*/
		/*
		HttpService.get$(`${Vars.host}/data/todos.json`).pipe(
			first(),
		).subscribe(response => {
			// console.log('AppComponent.items', response);
			this.items = response.data;
			this.pushChanges();
		});
		*/
		HttpService.get$<IResponseData>(`/rxcomp-http/data/get-todos.json`, {
			params: { q: { a: 1, b: 2, c: [1, 2, 3, 4] } },
			paramsEncoder: new HttpSerializerCodec()
		}).pipe(
			first(),
		).subscribe((response: IResponseData) => {
			this.items = response.data.getTodos;
			this.pushChanges();
			// console.log('AppComponent.getTodos', this.items);
		}, error => console.log);
		// HttpService.get$(`https://jsonplaceholder.typicode.com/users/1/todos`).pipe(
		errors$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(error => {
			this.error = error;
			this.pushChanges();
		});
	}
	onClick(item: { title: string, completed: boolean }) {
		item.completed = !item.completed;
		this.pushChanges();
	}
	static meta: IFactoryMeta = {
		selector: '[app-component]',
	};
}
