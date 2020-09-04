export default class HttpState {
	private static store_: { [k: string]: {} | undefined } = {};
	private static callbacks_: { [k: string]: () => {} | undefined } = {};
	static get<T>(key: string, defaultValue: T): T {
		return this.store_[key] !== undefined ? this.store_[key] as T : defaultValue;
	}
	static set<T>(key: string, value: T): void {
		this.store_[key] = value;
	}
	static remove<T>(key: string): T | undefined {
		const value: T | undefined = this.store_[key] as T | undefined;
		delete this.store_[key];
		return value;
	}
	static hasKey<T>(key: string): boolean {
		return this.store_.hasOwnProperty(key);
	}
	static onSerialize<T>(key: string, callback: () => T): void {
		this.callbacks_[key] = callback;
	}
	static toJson(): string {
		for (const key in this.callbacks_) {
			if (this.callbacks_.hasOwnProperty(key)) {
				try {
					this.store_[key] = this.callbacks_[key]();
				} catch (e) {
					console.warn('Exception in onSerialize callback: ', e);
				}
			}
		}
		return JSON.stringify(this.store_);
	}
}
export function makeStateKey<T = void>(key: string): string {
	return key as string;
}
export function escapeHtml(text: string): string {
	const escapedText: { [k: string]: string } = {
		'&': '&a;',
		'"': '&q;',
		'\'': '&s;',
		'<': '&l;',
		'>': '&g;',
	};
	return text.replace(/[&"'<>]/g, s => escapedText[s]);
}
export function unescapeHtml(text: string): string {
	const unescapedText: { [k: string]: string } = {
		'&a;': '&',
		'&q;': '"',
		'&s;': '\'',
		'&l;': '<',
		'&g;': '>',
	};
	return text.replace(/&[^;]+;/g, s => unescapedText[s]);
}
export function initHttpState(doc: Document, appId: string) {
	const script = doc.getElementById(appId + '-state');
	let initialState = {};
	if (script && script.textContent) {
		try {
			initialState = JSON.parse(unescapeHtml(script.textContent));
		} catch (e) {
			console.warn('Exception while restoring HttpState for app ' + appId, e);
		}
	}
	return initialState;
	// return HttpState.init(initialState);
}
