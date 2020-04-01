export interface IncomeModel {
  id?: string,
  invoice: string,
  date: Date,
  categoryID: string,
  description: string,
  vat: string,
  amount: number,
  autoNet: string,
  autoVat: string,
}

export class IncomeForm implements IncomeModel {
  private vatRate: number = 14; // Percent

  // public $id: string = Firebae Assigned;
  public invoice: string     = this.form.invoice || null;
  public date: Date          = this.form.date || null;
  public categoryID: string    = this.form.categoryID || null;
  public description: string = this.form.description || null;
  public vat: string         = this.form.vat || null;
  public amount: number      = this.form.amount || null;
  public autoNet: string     = this.autoCalculateNet(this.form.vat, this.form.amount) || null;
  public autoVat: string     = this.autoCalculateVat(this.form.amount, Number(this.autoNet)) || null;

  constructor(
    private form?: IncomeModel,
  ) {
    delete this.form;
  }

  autoCalculateNet(vat: string, amount: number): string {
    return (vat === "Incl.") ? (amount/(100 + this.vatRate)*100).toFixed(2) : amount.toString();
  }

  autoCalculateVat(amount: number, autoNet: number) {
    return (amount - autoNet).toFixed(2);
  }

}
