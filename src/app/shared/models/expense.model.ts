export interface ExpenseModel {
  id?: string,
  invoice: string,
  date: Date,
  categoryID: string,
  description: string,
  vatRate: number,
  vat: string,
  amount: number,
  autoVat?: number,
  autoNet?: number,
}

export class ExpenseForm implements ExpenseModel {

  // public $id: string = Firebae Assigned;
  public invoice: string     = this.form.invoice || null;
  public date: Date          = this.form.date || null;
  public categoryID: string    = this.form.categoryID || null;
  public description: string = this.form.description || null;
  public vatRate: number     = this.form.vatRate || 15;
  public vat: string         = this.form.vat || null;
  public amount: number      = this.form.amount || null;

  constructor(
    private form?: ExpenseModel,
  ) {
    delete this.form;
  }

}
