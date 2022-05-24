
(function () {

    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        }
    };

    var client = new Phaser.Game(config), score = 0, scoreText;

    function preload() {
        folder = ".";
        //this.load.setBaseURL('http://127.0.0.1');
        this.load.image('sky', folder + '/img/sky.png');
        this.load.image('ground', folder + '/img/platform.png');
        this.load.image('star', folder + '/img/star.png');
        this.load.spritesheet('dude', folder + '/img/dude.png', { frameWidth: 32, frameHeight: 48 })
    }


    function create() {
        this.add.sprite(0, 0, 'sky').setOrigin(0, 0);
        platforms = this.physics.add.staticGroup();
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        cursors = this.input.keyboard.createCursorKeys();
        player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0);
        player.setCollideWorldBounds(true);

        player.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        player.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        player.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        

    }

    function update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);

        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);

        }
        else {
            player.setVelocityX(0);
            player.anims.play('turn');

        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }

    function collectStar(player, star) {
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
    }

}())

