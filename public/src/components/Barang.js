import React from 'react'

const Barang = React.createClass({
    render: function() {
        return (
            <div className="mdl-card mdl-shadow--1dp m-b-30">
                <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">Striped table</h2>
                </div>
                <table className="mdl-data-table ml-table-striped mdl-js-data-table mdl-data-table--selectable is-upgraded" data-upgraded=",MaterialDataTable">
                    <colgroup>
                        <col className="auto-cell-size p-r-20"/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>
                                    <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" 
                                        data-upgraded=",MaterialCheckbox,MaterialRipple">
                                        <input type="checkbox" className="mdl-checkbox__input"/>
                                        <span className="mdl-checkbox__focus-helper"></span>
                                        <span className="mdl-checkbox__box-outline">
                                            <span className="mdl-checkbox__tick-outline">
                                </span>
                    </span><span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span className="mdl-ripple"></span></span></label></th><th className="mdl-data-table__cell--non-numeric">Material</th>
                                <th>Quantity</th>
                                <th>Unit price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" className="mdl-checkbox__input"/><span className="mdl-checkbox__focus-helper"></span><span className="mdl-checkbox__box-outline"><span className="mdl-checkbox__tick-outline"></span></span><span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span className="mdl-ripple"></span></span></label></td><td className="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                                <td>25</td>
                                <td>$2.90</td>
                            </tr>
                            <tr>
                                <td><label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" className="mdl-checkbox__input"/><span className="mdl-checkbox__focus-helper"></span><span className="mdl-checkbox__box-outline"><span className="mdl-checkbox__tick-outline"></span></span><span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span className="mdl-ripple"></span></span></label></td><td className="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>
                                <td>50</td>
                                <td>$1.25</td>
                            </tr>
                            <tr>
                                <td><label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" className="mdl-checkbox__input"/><span className="mdl-checkbox__focus-helper"></span><span className="mdl-checkbox__box-outline"><span className="mdl-checkbox__tick-outline"></span></span><span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span className="mdl-ripple"></span></span></label></td><td className="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>
                                <td>10</td>
                                <td>$2.35</td>
                            </tr>
                            <tr>
                                
<td>
<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple">
    <input type="checkbox" className="mdl-checkbox__input"/>
<span className="mdl-checkbox__focus-helper">
</span>
<span className="mdl-checkbox__box-outline">
<span className="mdl-checkbox__tick-outline">
</span>
</span>
<span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
<span className="mdl-ripple">
</span>
</span>
</label>
</td>
<td className="mdl-data-table__cell--non-numeric">Acrylic (Transparent)
</td>
                                <td>25</td>
                                <td>$2.90</td>
                            </tr>
                            <tr>
                                
<td>
<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple">
    <input type="checkbox" className="mdl-checkbox__input"/>
<span className="mdl-checkbox__focus-helper">
</span>
<span className="mdl-checkbox__box-outline">
<span className="mdl-checkbox__tick-outline">
</span>
</span>
<span className="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
<span className="mdl-ripple">
</span>
</span>
</label>
</td>
<td className="mdl-data-table__cell--non-numeric">Plywood (Birch)
</td>
                                <td>50</td>
                                <td>$1.25</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                );
}
});

module.exports = Barang
