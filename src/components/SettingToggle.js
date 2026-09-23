import { useState } from 'react';

function SettingToggle({ label, description, defaultChecked = true }) {
  const [checked, setChecked] = useState(defaultChecked);

  return <label className="setting-toggle-row"><span><strong>{label}</strong>{description && <small>{description}</small>}</span><input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} /><span className="toggle-control" aria-hidden="true"><span /></span></label>;
}

export default SettingToggle;
