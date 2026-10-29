import type {ReactNode} from 'react';
export interface ContinuationEntry {key:string;id:string;label:string;text:string;context?:string}
export interface ContinuationFragment extends ContinuationEntry {title:string;part:number}
export interface TextMeasurer {height(text:string,width?:number,size?:number,line?:number,weight?:number):number;dispose():void}
export function splitTextToFit(text:string,fits:(value:string)=>boolean):string[];
export function createTextMeasurer(doc?:Document):TextMeasurer;
export function paginateContinuationEntries(entries:ContinuationEntry[],measure:TextMeasurer,capacity?:number):ContinuationFragment[][];
export function continuationPages(React:typeof import('react'),pages:ContinuationFragment[][],options:{kind:string;title:string;firstPage?:number;signatures:string[]}):ReactNode[];
