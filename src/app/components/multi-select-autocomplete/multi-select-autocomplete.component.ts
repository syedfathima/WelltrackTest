import { ElementRef, HostBinding, Component, OnInit, ViewChild, forwardRef, Input, Optional, Self, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { NgControl, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
// import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { MatFormFieldControl } from "@angular/material/form-field";
import { FocusMonitor } from '@angular/cdk/a11y';
import { MultiAutoItem } from "../../models/multiautoitem";

@Component({
  selector: 'multiselect-autocomplete',
  templateUrl: 'multi-select-autocomplete.component.html',
  styleUrls: ['multi-select-autocomplete.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: MultiselectAutocomplete }]
})
export class MultiselectAutocomplete implements OnInit, MatFormFieldControl<MultiAutoItem> {

  @ViewChild('inputTrigger', { read: MatAutocompleteTrigger }) inputTrigger: MatAutocompleteTrigger;
  @Output() onSelectItems = new EventEmitter<any>();
  itemControl = new FormControl();
  stateChanges = new Subject<void>();
  private _placeholder: string;
  static nextId = 0;
  @HostBinding() id = `input-ac-${MultiselectAutocomplete.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  @Input() set value(value: any) {
    if (value) {
      this.selectedItems = value;
    }
    this.stateChanges.next();
  }
  get value() {
    return this.selectedItems;
  }
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private changeCallback: Function;
  private touchedCallback: Function;
  focused = false;
  isAllSelected = false;

  @Input() items = [];
  selectedItems: MultiAutoItem[] = new Array<MultiAutoItem>();
  filteredItems: MultiAutoItem[];
  // filteredItems: Observable<MultiAutoItem[]>;
  removable: boolean = true;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private fm: FocusMonitor,
    private elRef: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }
  empty: boolean;
  shouldLabelFloat: boolean;
  required: boolean;
  disabled: boolean;
  errorState: boolean;
  controlType?: string;
  autofilled?: boolean;
  userAriaDescribedBy?: string;
  onContainerClick(event: MouseEvent): void {
    throw new Error('Method not implemented.');
  }

  writeValue(value: any) {
    if(value && value.length === 0){
      let len = this.filteredItems.length;
      this.selectedItems = [];
      for (let i = 0; i < len; i++)
        this.filteredItems[i].selected = false;
      for (let i = 0; i < this.items.length; i++)
        this.items[i].selected = false;
    }
  }
  registerOnChange(fn: Function) {
    this.changeCallback = fn;
  }
  registerOnTouched(fn: Function) {
    this.touchedCallback = fn;
  }

  lastFilter = '';

  ngOnInit() {
    this.itemControl.valueChanges.pipe(
      startWith<string | MultiAutoItem[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this.filter(filter))
    ).subscribe(data => this.filteredItems = data);

  }
  clicker() {
    this.inputTrigger.openPanel();
  }
  filter(filter: string): MultiAutoItem[] {
    this.lastFilter = filter;
    if (filter) {
      return this.items.filter(option => {
        return option.item.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
    } else {
      return this.items.slice();
    }
  }

  optionClicked(event: Event, item: MultiAutoItem) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    let len = this.filteredItems.length;
    if (this.isAllSelected) {
      for (let i = 0; i < len; i++)
        this.filteredItems[i].selected = true;
      // this.selectedItems = data;
      this.selectedItems = this.filteredItems;
      for ( let i=0; i < this.items.length; i++)
        this.items[i].selected = true;
      this.selectedItems = this.items;
      // this.filteredItems. = [...this.items];
      // this.changeCallback(this.selectedItems);
      this.cd.markForCheck();
      // this.itemControl.updateValueAndValidity();
    } else {
      this.selectedItems = [];
      for (let i = 0; i < len; i++)
        this.filteredItems[i].selected = false;
      for (let i = 0; i < this.items.length; i++)
        this.items[i].selected = false;

    }
    // this.changeCallback(this.selectedItems);
    this.onSelectItems.emit(this.selectedItems);
  }
  toggleSelection(item: MultiAutoItem) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedItems.push(item);
      // this.changeCallback(this.selectedItems);
    } else {
      this.isAllSelected = false;
      const i = this.selectedItems.findIndex(value => value.item === item.item);
      this.selectedItems.splice(i, 1);
      // this.changeCallback(this.selectedItems);
    }
    this.onSelectItems.emit(this.selectedItems);
  }

  get commaseparatedSelectedItems() {
    let commaSeparated = "";

    if (this.selectedItems.length) {
      commaSeparated = this.selectedItems[0].item;
    }

    for (let i = 1; i < this.selectedItems.length; i++) {
      commaSeparated += ", " + this.selectedItems[i].item;
    }

    return commaSeparated;
  }

  ngOnDestroy() {
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.stateChanges.complete();
  }

}
