'use strict';

/*=================================================================

Units and The Relative Sizes of Objects

In the data, a stars mass and radius is measured in solar units.

A planet's mass and radius is measured in Earth Units.

Distances in the System like the semi-major axis are expressed in
AU, astronomical units.

1 Solar Radius = 110 Earth Radius
1 Solar Radius = 0.0046491 AU
1 Solar Mass = 333,060 Earth Mass

In the graphics rendering all units will be the arbitrary unit,
Helios Unit (HU). This is in reference to size alone, does not refer
to mass or luminosity

1 Solar Unit = 100 HU
1 Earth Unit = 3.5 HU
1 AU = 21509 HU <-- This is what needs to be scaled appropriately
                    Some planets, may be really close, while others
                    very far away. So the scale needs to be non-linear

=================================================================*/