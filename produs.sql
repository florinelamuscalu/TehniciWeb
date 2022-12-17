DROP TYPE IF EXISTS categ_produs;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_produs AS ENUM( 'periferice', 'PC', 'laptop', '1-componente-1-monitoare', '2-componente-1-RAM','2-componente-2-SSD', '2-componente-3-HDD', '3-componente-1-placa-video', '3-componente-2-placa-baza', '4-componente-1-procesor');
CREATE TYPE tipuri_produse AS ENUM('gaming', 'office','home');


CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),
   data_fabricare  TIMESTAMP NOT NULL CHECK (data_fabricare != null),
   tip_produs tipuri_produse DEFAULT 'home',
   categorie categ_produs,
   specificatii VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   desigilate BOOLEAN NOT NULL DEFAULT False,
   culoare VARCHAR(200),
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   garantie NUMERIC(2) DEFAULT 2
 
);

INSERT into produse (nume,descriere, pret, greutate, data_fabricare, tip_produs, categorie, specificatii, desigilate, culoare, imagine) VALUES 

('laptop ASUS E410MA','Laptop ultraportabil ASUS E410MA cu procesor Intel® Celeron® N4020 pana la 2.80 GHz, 14 inch, 4GB, 256GB M.2 NVMe™ PCIe® 3.0 SSD, Intel® UHD Graphics 600, No OS', 1200 , 1300, '2020-06-12', 'home', 'laptop', '{"Intel® Celeron® N4020", "4GB", "256GB M.2 NVMe™ PCIe® 3.0 SSD"}', False, 'gri', 'laptopp1.png'),

('laptop Acer Nitro 5 AN515-45',' Laptop Gaming Acer Nitro 5 AN515-45 cu procesor AMD Ryzen™ 5 5600H pana la 4.20 GHz, 15.6", Full HD, IPS, 144Hz, 8GB, 512GB SSD, NVIDIA® GeForce RTX™ 3050 4GB, NO OS, Black',  3800, 1400, '2021-08-29', 'gaming','laptop', '{"procesor AMD Ryzen™ 5 5600H ","15.6","Full HD","144Hz","16GB", "512GB SSD", "NVIDIA® GeForce GTX™ 1650 4GB"}', False, 'negru', 'laptop2.png'),

('laptop ASUS VivoBook 15 X1500EA','Laptop ASUS VivoBook 15 X1500EA cu procesor Intel® Core™ i3-1115G4 pana la 4.10 GHz, 15.6", Full HD, IPS, 8GB, 256GB SSD, Intel® UHD Graphics, No OS, Indie Black',  2800 , 1000, '2022-04-13', 'office', 'laptop', '{"Intel® Core™ i5-1135G7","15.6","Full HD","IPS","16GB","512GB SSD 32GB Intel® Optane™ Memory", "Intel Iris Xᵉ Graphics" }', False, 'negru','laptop3.png'),

('Placa video Gigabyte AORUS','Placa video Gigabyte AORUS GeForce® RTX™ 3070 MASTER 2.0 LHR, 8GB GDDR6, 256-bit',  4000 , 1000, '2020-06-02', 'gaming', '3-componente-1-placa-video', '{"nVidia GeForce RTX 3070","8 GB ","14000"}', True,'negru','placaVideo1.png'),

('Placa Video ASUS Cerberus','Placa video ASUS Cerberus GeForce® GTX 1050 Ti Advanced Edition, 4GB GDDR5, 128-bit ',  1200 , 1800, '2021-09-20', 'gaming', '3-componente-1-placa-video', '{"nVidia GeForce GTX 1050 Ti","NVIDIA GeForce GTX 1000","DDR5","8 GB", "7008"}', True, 'negru', 'placaVideo2.png'),

('Placa Video PowerColor','Placa video PowerColor Radeon™ RX 6900 XT Red Devil, 16GB GDDR6, 256-bit ', 4300 , 2300, '2021-10-24', 'gaming', '3-componente-1-placa-video', '{"AMD Radeon RX 6700 XT ","AMD Radeon RX 6000","DDR6","12 GB", "16000"}', False,'negru','placaVideo23.png'),

('RAM Memorie Corsair Vengeance','Memorie Corsair Vengeance RGB PRO 16GB, DDR4, 3200MHz, CL16, Dual Channel Kit',  400, 200, '2019-02-20', 'gaming', '2-componente-1-RAM', '{"DDR4", "PC4-25600", "16 GB","3200","Dual channel"}', False,'negru', 'ram1.png'),

('RAM Memorie G.Skill RipjawsX','Memorie G.Skill RipjawsX, 16GB (2x8GB) DDR3, 1600MHz, CL10, 1.5V ', 280 , 145, '2020-04-03', 'gaming', '2-componente-1-RAM', '{"DDR3","16 GB","1600","Dual channel"}', False, 'rosu', 'ram2.png'),

('RAM Memorie Kingston FURY Beast','Memorie Kingston FURY Beast, 16GB DDR4, 3200MHz CL16, Dual Channel Kit', 990, 180, '2020-10-21', 'gaming', '2-componente-1-RAM', '{"DDR5","32 GB","5600","Dual channel"}', True,'negru', 'ram3.png'),

('Placa de baza GIGABYTE Z790 GAMING X AX','Placa de baza GIGABYTE Z790 GAMING X AX ', 1600, 2300, '2021-11-01', 'gaming', '3-componente-2-placa-baza', '{"1700","Intel® Z790","Intel 12th Generation Core/Pentium Gold/Celeron Intel Core 13th Gen","DDR5", "128 GB"}', True, 'negru','placaBaza1.png'),

('Placa de baza ASUS PRIME H510M-K','Placa de baza ASUS PRIME H510M-K, Socket 1200 ',  450, 1880, '2020-01-12', 'gaming', '3-componente-2-placa-baza', '{"1200","H510","Intel® Core™", "Pentium® Gold si Celeron® din a 11-a si a 10-a generatie ","DDR4", "64 GB"}', True,'negru', 'placaBaza2.png'),

('Placa de baza ASUS ROG ZENITH X399 EXTREME ALPHA','Placa de baza ASUS ROG ZENITH X399 EXTREME ALPHA, Socket TR4 ', 3900, 2680, '2022-03-21', 'gaming', '3-componente-2-placa-baza', '{"TR4","X399","AMD Ryzen Threadripper", "DDR4"}', False,'negru','placaBaza3.png'),

('Procesor Intel® Core™ i9-12900KF Alder Lake','Procesor Intel® Core™ i9-12900KF Alder Lake, 3.2GHz, 30MB, fara grafica integrata, Socket 1700 ', 2700, 300, '2022-07-13', 'gaming', '4-componente-1-procesor', '{"30 MB","1700","Efficient-core: 2400 MHz Performance-core: 3200 MHz", "5200 MHz"}', False, 'gri', 'procesor1.png'),

('Procesor AMD Ryzen™ 9 7950X','Procesor AMD Ryzen™ 9 7950X, 80MB, 4.5/5.7GHz Max Boost, Socket AM5, Radeon Graphics ', 3200, 400, '2022-10-26', 'gaming', '4-componente-1-procesor', '{"80 MB","AM5","AMD Ryzen™ Technologies AMD EXPO™ Technology AMD Radeon™ Graphics", "5.7 GHz "}', False,'gri', 'procesor2.png'),

('Procesor Intel® Core™ i9-13900K Raptor Lake','Procesor Intel® Core™ i9-13900K Raptor Lake, 3.0GHz, 5.8 GHz turbo, 36MB, Socket 1700 ', 3370, 400, '2022-01-06', 'gaming', '4-componente-1-procesor', '{"36 MB","1700", "5800 MHz"}', False,'gri', 'procesor3.png'),

('SSD Samsung 980 500GB','Solid State Drive (SSD) Samsung 980 500GB, NVMe, M.2. ', 270, 100, '2020-05-15', 'gaming', '2-componente-2-SSD', '{"M.2","500 GB", "3100", "2600"}', False,'negru', 'SSD1.png'),

('SSD Samsung 870 EVO','Solid State Drive (SSD) Samsung 870 EVO, 1TB, 2.5", SATA III ', 500, 200, '2021-10-10', 'gaming', '2-componente-2-SSD', '{"2.5 inch","1 TB", "560", "530"}', False,'negru', 'SSD2.png'),

('SSD Samsung 980 PRO Gen.4','Solid State Drive (SSD) Samsung 980 PRO Gen.4, 1TB, NVMe, M.2. ', 692, 100, '2021-12-15', 'gaming', '2-componente-2-SSD', '{"M.2","1 TB", "7000", "5000"}', True,'negru', 'SSD3.png'),

('HDD WD Blue', 'HDD WD Blue 2TB, 7200rpm',280, 100, '2020-08-05', 'gaming', '2-componente-3-HDD', '{"1 TB", "7200 rpm", "256 MB"}', False,'albastru', 'HDD1.png'),

('HDD Seagate BarraCuda','HDD Seagate BarraCuda 4TB', 410, 100, '2021-02-15', 'gaming', '2-componente-3-HDD', '{"4 TB", "5400 rpm", "256 MB"}', False,'verde', 'HDD2.png'),

('HDD Seagate Constellation','HDD Seagate Constellation ES.3 4TB', 415, 100, '2021-04-10', 'gaming', '2-componente-3-HDD', '{"4 TB", "7200 rpm", "128 MB"}', False,'negru', 'HDD3.png')

GRANT ALL PRIVILEGES ON DATABASE pc TO flori2 ;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO flori2;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO flori2;