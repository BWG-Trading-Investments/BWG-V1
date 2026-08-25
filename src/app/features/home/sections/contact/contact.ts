import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The contact section.
 *
 * All copy is verbatim from the BWG website data document. Nothing here is
 * paraphrased or invented; where the source contains a typo it is reproduced as
 * written rather than silently corrected.
 */
interface ContactDetail {
  readonly label: string;
  readonly value: string;
}

interface ContactCopy {
  readonly headingLines: readonly string[];
  readonly body: readonly string[];
  readonly closing: string;
  readonly actions: readonly string[];
  readonly addressLines: readonly string[];
  readonly details: readonly ContactDetail[];
}

const COPY: ContactCopy = {
  headingLines: ['THE NEXT OPPORTUNITY', 'COULD START HERE.'],
  body: [
    'Whether you are looking for a strategic partner, entering a new market, developing a new business, investing in an opportunity or transforming an existing operation —',
    'BWG is ready to build it with you.',
  ],
  closing: "LET'S GENERATE VALUE TOGETHER.",
  actions: ['PARTNER WITH BWG', 'INVEST WITH BWG', 'CONTACT US'],
  addressLines: [
    'Sama Towers, Tower Z, 9th Floor, Office 91',
    'Zahraa El Maadi, Maadi Ring Road',
    'Cairo, Egypt.',
  ],
  details: [
    // Reproduced exactly as written in the source document. Note that the email
    // domain there reads "bwg-tarding.com" while the website line reads
    // "bwg-trading.com"; correcting it would mean inventing an address, so it is
    // left as written and flagged for BWG to confirm.
    { label: 'Email', value: 'info@bwg-tarding.com' },
    { label: 'Website', value: 'www.bwg-trading.com' },
    { label: 'Mobile', value: '01031699905' },
    { label: 'Customer service', value: '01031799928' },
  ],
};

@Component({
  selector: 'bwg-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly copy = COPY;
}
