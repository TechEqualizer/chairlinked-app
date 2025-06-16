import React from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  Heading, 
  Text, 
  Label,
  Input,
  Textarea,
  Container,
  Section,
  Grid,
  Flex,
  GlassMorphism,
  GlassCard,
  Badge,
  Avatar,
  AvatarGroup,
  Spinner,
  Divider
} from '../index';
import { colors, spacing, typography } from '../tokens';
import { hexToRgba, lightenColor, darkenColor } from '../utils/colorUtils';

/**
 * Design System Showcase component
 * 
 * This component demonstrates the various components and styles
 * available in the Template 8 design system.
 */
const DesignSystemShowcase: React.FC = () => {
  return (
    <Container>
      <Section paddingTop="lg" paddingBottom="lg">
        <Heading as="h1" size="2xl" align="center" className="mb-4">
          Template 8 Design System
        </Heading>
        <Text align="center" size="lg" className="mb-12">
          A comprehensive design system for building beautiful, consistent interfaces
        </Text>

        {/* Typography */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              <div>
                <Label>Headings</Label>
                <Heading as="h1" size="4xl" className="mb-4">Heading 4XL</Heading>
                <Heading as="h1" size="3xl" className="mb-4">Heading 3XL</Heading>
                <Heading as="h1" size="2xl" className="mb-4">Heading 2XL</Heading>
                <Heading as="h2" size="xl" className="mb-4">Heading XL</Heading>
                <Heading as="h3" size="lg" className="mb-4">Heading LG</Heading>
                <Heading as="h4" size="md" className="mb-4">Heading MD</Heading>
                <Heading as="h5" size="sm" className="mb-4">Heading SM</Heading>
                <Heading as="h6" size="xs" className="mb-4">Heading XS</Heading>
              </div>

              <div>
                <Label>Text</Label>
                <Text size="xl" className="mb-2">Text XL</Text>
                <Text size="lg" className="mb-2">Text LG</Text>
                <Text size="md" className="mb-2">Text MD</Text>
                <Text size="sm" className="mb-2">Text SM</Text>
                <Text size="xs" className="mb-2">Text XS</Text>
              </div>

              <div>
                <Label>Font Weights</Label>
                <Text weight="light" className="mb-2">Light Text</Text>
                <Text weight="normal" className="mb-2">Normal Text</Text>
                <Text weight="medium" className="mb-2">Medium Text</Text>
                <Text weight="semibold" className="mb-2">Semibold Text</Text>
                <Text weight="bold" className="mb-2">Bold Text</Text>
              </div>

              <div>
                <Label>Font Families</Label>
                <Text font="inter" className="mb-2">Inter (Modern Sans)</Text>
                <Text font="playfair" className="mb-2">Playfair Display (Luxury Serif)</Text>
                <Text font="oswald" className="mb-2">Oswald (Bold Sans)</Text>
                <Text font="comfortaa" className="mb-2">Comfortaa (Creative Sans)</Text>
                <Text font="lora" className="mb-2">Lora (Classic Serif)</Text>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Primary Colors */}
              <div>
                <Label className="mb-2">Primary Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colors.primary).map(([shade, color]) => (
                    <div key={shade} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-1"
                        style={{ backgroundColor: color }}
                      />
                      <Text size="xs">{shade}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Colors */}
              <div>
                <Label className="mb-2">Secondary Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colors.secondary).map(([shade, color]) => (
                    <div key={shade} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-1"
                        style={{ backgroundColor: color }}
                      />
                      <Text size="xs">{shade}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neutral Colors */}
              <div>
                <Label className="mb-2">Neutral Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(colors.neutral).map(([shade, color]) => (
                    <div key={shade} className="flex flex-col items-center">
                      <div 
                        className="w-16 h-16 rounded-md mb-1"
                        style={{ backgroundColor: color }}
                      />
                      <Text size="xs">{shade}</Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <Label className="mb-2">Status Colors</Label>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <Text size="sm" className="mb-1">Success</Text>
                    <div className="flex flex-wrap gap-2">
                      {[500, 600, 700].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-md mb-1"
                            style={{ backgroundColor: colors.success[shade as keyof typeof colors.success] }}
                          />
                          <Text size="xs">{shade}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Text size="sm" className="mb-1">Warning</Text>
                    <div className="flex flex-wrap gap-2">
                      {[500, 600, 700].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-md mb-1"
                            style={{ backgroundColor: colors.warning[shade as keyof typeof colors.warning] }}
                          />
                          <Text size="xs">{shade}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Text size="sm" className="mb-1">Error</Text>
                    <div className="flex flex-wrap gap-2">
                      {[500, 600, 700].map((shade) => (
                        <div key={shade} className="flex flex-col items-center">
                          <div 
                            className="w-12 h-12 rounded-md mb-1"
                            style={{ backgroundColor: colors.error[shade as keyof typeof colors.error] }}
                          />
                          <Text size="xs">{shade}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Button Variants */}
              <div>
                <Label className="mb-4">Button Variants</Label>
                <Flex gap="sm" wrap="wrap">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="success">Success</Button>
                </Flex>
              </div>

              {/* Button Sizes */}
              <div>
                <Label className="mb-4">Button Sizes</Label>
                <Flex gap="sm" align="center" wrap="wrap">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </Flex>
              </div>

              {/* Button States */}
              <div>
                <Label className="mb-4">Button States</Label>
                <Flex gap="sm" wrap="wrap">
                  <Button>Default</Button>
                  <Button disabled>Disabled</Button>
                  <Button isLoading>Loading</Button>
                  <Button leftIcon={<span>👍</span>}>With Left Icon</Button>
                  <Button rightIcon={<span>👉</span>}>With Right Icon</Button>
                  <Button fullWidth>Full Width Button</Button>
                </Flex>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} colsMd={2} colsLg={3} gap="md">
              {/* Default Card */}
              <Card variant="default" elevation="md">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text>This is a default card with medium elevation.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* Outline Card */}
              <Card variant="outline" elevation="sm">
                <CardHeader>
                  <CardTitle>Outline Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text>This is an outline card with small elevation.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">Action</Button>
                </CardFooter>
              </Card>

              {/* Filled Card */}
              <Card variant="filled" elevation="lg">
                <CardHeader>
                  <CardTitle>Filled Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text>This is a filled card with large elevation.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="secondary">Action</Button>
                </CardFooter>
              </Card>

              {/* Glass Card */}
              <Card variant="glass" elevation="xl" isHoverable>
                <CardHeader>
                  <CardTitle>Glass Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text>This is a glass card with extra large elevation and hover effect.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* Interactive Card */}
              <Card variant="default" elevation="md" isInteractive>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text>This card has interactive hover and active states.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>

              {/* No Padding Card */}
              <Card variant="default" elevation="md" noPadding>
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43" 
                  alt="Sample" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <Heading as="h3" size="sm" className="mb-2">No Padding Card</Heading>
                  <Text size="sm">This card has no default padding for custom layouts.</Text>
                </div>
              </Card>
            </Grid>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} colsMd={2} gap="lg">
              {/* Input Variants */}
              <div>
                <Label className="mb-4">Input Variants</Label>
                <div className="space-y-4">
                  <Input placeholder="Default Input" />
                  <Input variant="filled" placeholder="Filled Input" />
                  <Input variant="outline" placeholder="Outline Input" />
                  <Input variant="ghost" placeholder="Ghost Input" />
                </div>
              </div>

              {/* Input Sizes */}
              <div>
                <Label className="mb-4">Input Sizes</Label>
                <div className="space-y-4">
                  <Input inputSize="sm" placeholder="Small Input" />
                  <Input inputSize="md" placeholder="Medium Input" />
                  <Input inputSize="lg" placeholder="Large Input" />
                </div>
              </div>

              {/* Input States */}
              <div>
                <Label className="mb-4">Input States</Label>
                <div className="space-y-4">
                  <Input placeholder="Default Input" />
                  <Input placeholder="Disabled Input" disabled />
                  <Input placeholder="Error Input" error errorMessage="This field is required" />
                </div>
              </div>

              {/* Input with Icons */}
              <div>
                <Label className="mb-4">Input with Icons</Label>
                <div className="space-y-4">
                  <Input 
                    placeholder="Input with Left Icon" 
                    leftIcon={<span>🔍</span>} 
                  />
                  <Input 
                    placeholder="Input with Right Icon" 
                    rightIcon={<span>✓</span>} 
                  />
                  <Input 
                    placeholder="Input with Both Icons" 
                    leftIcon={<span>📧</span>} 
                    rightIcon={<span>✓</span>} 
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <Label className="mb-4">Textarea</Label>
                <div className="space-y-4">
                  <Textarea placeholder="Default Textarea" />
                  <Textarea 
                    variant="filled" 
                    placeholder="Filled Textarea" 
                  />
                  <Textarea 
                    placeholder="Error Textarea" 
                    error 
                    errorMessage="This field is required" 
                  />
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Layout Components */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Layout Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Container */}
              <div>
                <Label className="mb-4">Container</Label>
                <div className="space-y-4">
                  <Container size="sm" className="bg-gray-100 p-4">
                    <Text align="center">Small Container (640px)</Text>
                  </Container>
                  <Container size="md" className="bg-gray-100 p-4">
                    <Text align="center">Medium Container (768px)</Text>
                  </Container>
                  <Container size="lg" className="bg-gray-100 p-4">
                    <Text align="center">Large Container (1024px)</Text>
                  </Container>
                </div>
              </div>

              {/* Grid */}
              <div>
                <Label className="mb-4">Grid</Label>
                <Grid cols={2} colsMd={3} colsLg={4} gap="md">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div key={item} className="bg-gray-100 p-4 rounded-md">
                      <Text align="center">Item {item}</Text>
                    </div>
                  ))}
                </Grid>
              </div>

              {/* Flex */}
              <div>
                <Label className="mb-4">Flex</Label>
                <div className="space-y-4">
                  <Flex gap="md" className="bg-gray-100 p-4 rounded-md">
                    <div className="bg-white p-2 rounded">Item 1</div>
                    <div className="bg-white p-2 rounded">Item 2</div>
                    <div className="bg-white p-2 rounded">Item 3</div>
                  </Flex>
                  
                  <Flex direction="col" gap="md" className="bg-gray-100 p-4 rounded-md">
                    <div className="bg-white p-2 rounded">Item 1</div>
                    <div className="bg-white p-2 rounded">Item 2</div>
                    <div className="bg-white p-2 rounded">Item 3</div>
                  </Flex>
                  
                  <Flex justify="between" align="center" className="bg-gray-100 p-4 rounded-md">
                    <div className="bg-white p-2 rounded">Start</div>
                    <div className="bg-white p-2 rounded">Center</div>
                    <div className="bg-white p-2 rounded">End</div>
                  </Flex>
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Glass Morphism */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Glass Morphism</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 mb-8">
              <Grid cols={1} colsMd={3} gap="md">
                <GlassMorphism variant="light" intensity="medium" className="p-4">
                  <Text>Light Glass</Text>
                </GlassMorphism>
                
                <GlassMorphism variant="dark" intensity="medium" className="p-4">
                  <Text color="white">Dark Glass</Text>
                </GlassMorphism>
                
                <GlassMorphism variant="colored" color="#8B5CF6" intensity="medium" className="p-4">
                  <Text color="white">Colored Glass</Text>
                </GlassMorphism>
              </Grid>
              
              <div className="mt-4">
                <GlassCard variant="light" padding="md" className="mb-4">
                  <Heading as="h3" size="sm" className="mb-2">Glass Card</Heading>
                  <Text size="sm">A card with glass morphism effects</Text>
                </GlassCard>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Badge Variants */}
              <div>
                <Label className="mb-4">Badge Variants</Label>
                <Flex gap="sm" wrap="wrap">
                  <Badge variant="default" color="primary">Default</Badge>
                  <Badge variant="outline" color="primary">Outline</Badge>
                  <Badge variant="filled" color="primary">Filled</Badge>
                  <Badge variant="subtle" color="primary">Subtle</Badge>
                </Flex>
              </div>

              {/* Badge Colors */}
              <div>
                <Label className="mb-4">Badge Colors</Label>
                <Flex gap="sm" wrap="wrap">
                  <Badge color="primary">Primary</Badge>
                  <Badge color="secondary">Secondary</Badge>
                  <Badge color="success">Success</Badge>
                  <Badge color="warning">Warning</Badge>
                  <Badge color="error">Error</Badge>
                  <Badge color="neutral">Neutral</Badge>
                </Flex>
              </div>

              {/* Badge Sizes */}
              <div>
                <Label className="mb-4">Badge Sizes</Label>
                <Flex gap="sm" align="center" wrap="wrap">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </Flex>
              </div>

              {/* Badge with Dot */}
              <div>
                <Label className="mb-4">Badge with Dot</Label>
                <Flex gap="sm" wrap="wrap">
                  <Badge withDot>With Dot</Badge>
                  <Badge withDot color="success">Online</Badge>
                  <Badge withDot color="error">Offline</Badge>
                  <Badge withDot color="warning">Away</Badge>
                </Flex>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Avatar Sizes */}
              <div>
                <Label className="mb-4">Avatar Sizes</Label>
                <Flex gap="sm" align="center" wrap="wrap">
                  <Avatar size="xs" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar size="sm" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar size="md" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar size="lg" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar size="xl" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar size="2xl" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                </Flex>
              </div>

              {/* Avatar Shapes */}
              <div>
                <Label className="mb-4">Avatar Shapes</Label>
                <Flex gap="sm" wrap="wrap">
                  <Avatar shape="circle" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar shape="square" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                  <Avatar shape="rounded" src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" />
                </Flex>
              </div>

              {/* Avatar Fallbacks */}
              <div>
                <Label className="mb-4">Avatar Fallbacks</Label>
                <Flex gap="sm" wrap="wrap">
                  <Avatar fallbackInitials="JD" />
                  <Avatar fallbackInitials="AB" />
                  <Avatar fallbackInitials="CK" />
                  <Avatar /> {/* Default user icon */}
                </Flex>
              </div>

              {/* Avatar with Status */}
              <div>
                <Label className="mb-4">Avatar with Status</Label>
                <Flex gap="sm" wrap="wrap">
                  <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" status="online" />
                  <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" status="offline" />
                  <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" status="away" />
                  <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b72147ce" status="busy" />
                </Flex>
              </div>

              {/* Avatar Group */}
              <div>
                <Label className="mb-4">Avatar Group</Label>
                <AvatarGroup
                  avatars={[
                    { src: "https://images.unsplash.com/photo-1494790108755-2616b72147ce", alt: "User 1" },
                    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", alt: "User 2" },
                    { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9", alt: "User 3" },
                    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e", alt: "User 4" },
                    { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e", alt: "User 5" },
                    { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", alt: "User 6" },
                  ]}
                  max={4}
                />
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Spinners */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Spinners</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} colsMd={2} gap="lg">
              {/* Spinner Variants */}
              <div>
                <Label className="mb-4">Spinner Variants</Label>
                <Flex gap="md" wrap="wrap">
                  <Spinner variant="border" />
                  <Spinner variant="dots" />
                  <Spinner variant="grow" />
                </Flex>
              </div>

              {/* Spinner Sizes */}
              <div>
                <Label className="mb-4">Spinner Sizes</Label>
                <Flex gap="md" align="center" wrap="wrap">
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </Flex>
              </div>

              {/* Spinner Colors */}
              <div>
                <Label className="mb-4">Spinner Colors</Label>
                <Flex gap="md" wrap="wrap">
                  <Spinner color={colors.primary[500]} />
                  <Spinner color={colors.secondary[500]} />
                  <Spinner color={colors.success[500]} />
                  <Spinner color={colors.warning[500]} />
                  <Spinner color={colors.error[500]} />
                </Flex>
              </div>

              {/* Spinner with Label */}
              <div>
                <Label className="mb-4">Spinner with Label</Label>
                <Flex gap="md" direction="col">
                  <Spinner label="Loading..." />
                  <Spinner label="Processing..." labelPosition="right" />
                  <Spinner label="Please wait..." labelPosition="top" />
                </Flex>
              </div>
            </Grid>
          </CardContent>
        </Card>

        {/* Dividers */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Dividers</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={1} gap="lg">
              {/* Divider Variants */}
              <div>
                <Label className="mb-4">Divider Variants</Label>
                <div className="space-y-8">
                  <Divider />
                  <Divider variant="dashed" />
                  <Divider variant="dotted" />
                </div>
              </div>

              {/* Divider Thickness */}
              <div>
                <Label className="mb-4">Divider Thickness</Label>
                <div className="space-y-8">
                  <Divider thickness="thin" />
                  <Divider thickness="normal" />
                  <Divider thickness="thick" />
                </div>
              </div>

              {/* Divider with Label */}
              <div>
                <Label className="mb-4">Divider with Label</Label>
                <div className="space-y-8">
                  <Divider label="Center Label" />
                  <Divider label="Start Label" labelPosition="start" />
                  <Divider label="End Label" labelPosition="end" />
                </div>
              </div>

              {/* Divider Colors */}
              <div>
                <Label className="mb-4">Divider Colors</Label>
                <div className="space-y-8">
                  <Divider color={colors.primary[500]} label="Primary" />
                  <Divider color={colors.secondary[500]} label="Secondary" />
                  <Divider color={colors.error[500]} label="Error" />
                </div>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
};

export default DesignSystemShowcase;
